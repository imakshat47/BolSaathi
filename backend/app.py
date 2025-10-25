from __future__ import annotations as _annotations

"""
FastAPI + Groq API (LLM service)

Features:
- Endpoints: /summarize, /qa, /extract_entities, /generate_note, /introduction, /query
- Groq API only (OpenAI-compatible client)
- Reusable prompt templates
- Pydantic request/response models
- Async + logging + error handling
"""

import os
import json
import logging
import uvicorn
from typing import Any, Dict, List, Optional, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from openai import AsyncOpenAI, OpenAI  # works with Groq since it's OpenAI-compatible
from tavily import TavilyClient
# from groq import Groq

# client = Groq()

# ---------------------------------------------------------------------
# Config & Logging
# ---------------------------------------------------------------------
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("groq-llm-service")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("Missing GROQ_API_KEY in environment.")

client = AsyncOpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

# ---------------------------------------------------------------------
# Prompt Factory
# ---------------------------------------------------------------------
class PromptFactory:
    @staticmethod
    def summarize(text: str, style="abstractive", length="medium") -> List[Dict[str,str]]:
        return [
            {"role":"system","content":"You are a careful summarizer for medical/technical text."},
            {"role":"user","content":f"Summarize this text.\nStyle: {style}\nLength: {length}\n\n{text}"}
        ]
    @staticmethod
    def qa(question: str, context: str) -> List[Dict[str,str]]:
        return [
            {"role":"system","content":"You are a precise QA assistant. Use only context given."},
            {"role":"user","content":f"Q: {question}\nContext:\n{context}"}
        ]
    @staticmethod
    def entities(text: str) -> List[Dict[str,str]]:
        return [
            {"role":"system","content":"Extract entities as JSON with keys problems, medications, allergies, procedures, tests, dates, clinicians."},
            {"role":"user","content":f"Extract entities from:\n{text}"}
        ]
    @staticmethod
    def note(transcript: str, chart: Optional[str]) -> List[Dict[str,str]]:
        return [
            {"role":"system","content":"Generate a SOAP note JSON with keys subjective, objective, assessment[], plan[], icd10_codes[], snomed_codes[], medications_to_start[], follow_up[]."},
            {"role":"user","content":f"Transcript:\n{transcript}\n\nChart:\n{chart or '(none)'}"}
        ]
    @staticmethod
    def introduction(user_input: str, schema: Dict[str,Any]) -> List[Dict[str,str]]:
        return [
            {"role":"system","content":"Extract details and return valid JSON object only."},
            {"role":"user","content":f"Input: {user_input}\nSchema:\n{json.dumps(schema)}"}
        ]
    @staticmethod
    def query(user_input: str, links: List[str]) -> List[Dict[str,str]]:
        return [
            {"role":"system","content":"Answer user query. If links are provided, cite them. Return JSON with keys response and support_links[]."},
            {"role":"user","content":f"Question: {user_input}\nLinks: {links}"}
        ]


# ---------------------------------------------------------------------
# LLM Utility
# ---------------------------------------------------------------------

CHAT_PROMPT = """
SYSTEM PROMPT:

You are a professional and empathetic Healthcare Support Assistant.

Your task:
- Understand the user's message.
- If the message is healthcare-related, respond accurately and compassionately.
- If it's unrelated to healthcare, politely redirect the user to ask a healthcare-related question.
- Maintain a warm, respectful tone as if you were a hospital support staff member assisting a patient.

Always provide clear, safe, and non-diagnostic information.
Include disclaimers when needed.

Example response if off-topic:
"I'm here to help with healthcare questions or wellness advice. Could you please share something related to your health or medical care?"
"""

async def run_llm(messages: List[Dict[str,str]], json_mode=False, request_prompt=None, **kwargs) -> str:
    try:
        response = await client.responses.create(
            input= request_prompt + "\n".join(f"{m['role']}: {m['content']}" for m in messages),
            model="openai/gpt-oss-20b",
        )    
        return response.output_text
    except Exception as e:
        logger.exception("Groq API error")
        raise HTTPException(status_code=502, detail=str(e))


# ---------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------
app = FastAPI(title="Groq LLM API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

@app.get("/")
async def health():
    return {"status":"ok","model":MODEL,"provider":"groq"}


# ---------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------
class SummarizeRequest(BaseModel):
    text: str
    style: Literal["abstractive","extractive"]="abstractive"
    length: Literal["short","medium","long"]="medium"

class QARequest(BaseModel):
    question: str
    context: str

class EntitiesRequest(BaseModel):
    text: str

class NoteRequest(BaseModel):
    transcript: str
    chart_context: Optional[str]=None

class IntroRequest(BaseModel):
    session_id: str
    user_input: str

class QueryRequest(BaseModel):
    session_id: str
    user_input: str

# Example schema
USER_SCHEMA = {"name":"","age":"","gender":"","profession":"","place":"","other_details":{}}


# ---------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------
@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    out = await run_llm(PromptFactory.summarize(req.text, req.style, req.length))
    return {"summary": out.strip()}

@app.post("/qa")
async def qa(req: QARequest):
    out = await run_llm(PromptFactory.qa(req.question, req.context))
    return {"answer": out.strip()}

@app.post("/extract_entities")
async def extract_entities(req: EntitiesRequest):
    out = await run_llm(PromptFactory.entities(req.text), json_mode=True)
    try:
        return {"entities": json.loads(out)}
    except Exception:
        return {"entities":{"raw":out}}

@app.post("/generate_note")
async def generate_note(req: NoteRequest):
    out = await run_llm(PromptFactory.note(req.transcript, req.chart_context), json_mode=True, max_tokens=1600)
    try:
        return {"note": json.loads(out)}
    except Exception:
        return {"note":{"raw":out}}

@app.post("/introduction")
async def introduction(req: IntroRequest):
    out = await run_llm(PromptFactory.introduction(req.user_input, USER_SCHEMA), json_mode=True)
    try:
        return {"data": json.loads(out)}
    except Exception:
        return {"data":{"raw":out}}

@app.post("/query")
async def query(req: QueryRequest):
    links = []
    try:
        res = tavily.search(req.user_input, max_results=3)
        links = [r.get("url") for r in res.get("results",[])]
    except Exception as e:
        logger.warning(f"Tavily failed: {e}")
    out = await run_llm(PromptFactory.query(req.user_input, links), json_mode=True, request_prompt=CHAT_PROMPT)
    try:
        return {"data": json.loads(out)}
    except Exception:
        return {"data":{"response":out,"support_links":links}}


# ---------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=int(os.getenv("PORT",5000)), reload=True)
