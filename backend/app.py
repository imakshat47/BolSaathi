from __future__ import annotations as _annotations

"""
FastAPI LLM Microservice (multi-endpoint, provider-agnostic)

Features
- Endpoints: /summarize, /qa, /extract_entities, /generate_note, /introduction, /query
- Clean service layer (LLMService + Provider adapters)
- Structured prompting (system+user), reusable templates
- Multiple providers: OpenAI-compatible (incl. Groq/OpenRouter via base_url), HuggingFace (stub)
- Pydantic request/response models per endpoint
- Async, logging, error handling, CORS
- Extensible design

Environment (examples)
- OPENAI_API_KEY=sk-...
- OPENAI_BASE_URL=https://api.openai.com/v1           # or Groq/OpenRouter OpenAI-compatible endpoint
- OPENAI_MODEL=gpt-4o-mini
- HF_API_URL=http://localhost:8080/generate           # optional (Text Generation Inference) 
- HF_MODEL=meta-llama/Llama-3-8B-Instruct
- TAVILY_API_KEY=...
"""

import os
import json
import uuid
import logging
import asyncio
from typing import Any, Dict, List, Optional, Literal, Union

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field, ValidationError

# --- Load env & logging -------------------------------------------------------
load_dotenv()
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("llm-service")

# --- Optional external clients -----------------------------------------------
from tavily import TavilyClient  # For your existing /query workflow
from openai import AsyncOpenAI    # OpenAI-compatible async client


# =============================================================================
# Provider Layer
# =============================================================================

class ProviderConfig(BaseModel):
    provider: Literal["openai", "huggingface"] = Field(
        default=os.getenv("PROVIDER", "openai")
    )
    # OpenAI-compatible
    openai_api_key: Optional[str] = Field(default_factory=lambda: os.getenv("OPENAI_API_KEY"))
    openai_base_url: Optional[str] = Field(default_factory=lambda: os.getenv("OPENAI_BASE_URL"))
    openai_model: str = Field(default=os.getenv("OPENAI_MODEL", "gpt-4o-mini"))
    # HuggingFace / TGI (stubbed)
    hf_api_url: Optional[str] = Field(default_factory=lambda: os.getenv("HF_API_URL"))
    hf_model: Optional[str] = Field(default_factory=lambda: os.getenv("HF_MODEL"))

class LLMMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class LLMResponse(BaseModel):
    text: str
    raw: Optional[Dict[str, Any]] = None

class BaseLLMClient:
    async def acomplete(self, messages: List[LLMMessage], **kwargs) -> LLMResponse:
        raise NotImplementedError

class OpenAICompatClient(BaseLLMClient):
    """
    Works with OpenAI and OpenAI-compatible endpoints (Groq/OpenRouter) via base_url.
    """
    def __init__(self, cfg: ProviderConfig):
        if not cfg.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY missing")
        self.client = AsyncOpenAI(api_key=cfg.openai_api_key, base_url=cfg.openai_base_url)
        self.model = cfg.openai_model

    async def acomplete(self, messages: List[LLMMessage], **kwargs) -> LLMResponse:
        try:
            resp = await self.client.chat.completions.create(
                model=kwargs.get("model", self.model),
                messages=[m.dict() for m in messages],
                temperature=kwargs.get("temperature", 0.2),
                max_tokens=kwargs.get("max_tokens", 1200),
                response_format=kwargs.get("response_format")  # can be {"type":"json_object"}
            )
            text = resp.choices[0].message.content or ""
            return LLMResponse(text=text, raw=resp.model_dump())
        except Exception as e:
            logger.exception("OpenAICompatClient error")
            raise HTTPException(status_code=502, detail=f"LLM upstream error: {e}")

class HFStubClient(BaseLLMClient):
    """
    Minimal HuggingFace/TGI stub. Replace with real HTTP calls to your inference server.
    Intent: keep interface compatible for easy swap.
    """
    def __init__(self, cfg: ProviderConfig):
        if not cfg.hf_api_url:
            logger.warning("HF_API_URL not set; HF client will raise if used.")
        self.api_url = cfg.hf_api_url
        self.model = cfg.hf_model or "unknown"

    async def acomplete(self, messages: List[LLMMessage], **kwargs) -> LLMResponse:
        # For demonstration: join messages into a simple prompt and echo.
        # Replace with real TGI call using httpx and your server's schema.
        if not self.api_url:
            raise HTTPException(status_code=500, detail="HF_API_URL not configured.")
        prompt = "\n".join(f"{m.role.upper()}: {m.content}" for m in messages) + "\nASSISTANT:"
        text = f"[HF-STUB:{self.model}] {prompt[:400]}"
        return LLMResponse(text=text, raw={"stub": True})


def build_llm_client(cfg: ProviderConfig) -> BaseLLMClient:
    if cfg.provider == "openai":
        return OpenAICompatClient(cfg)
    elif cfg.provider == "huggingface":
        return HFStubClient(cfg)
    else:
        raise RuntimeError(f"Unsupported provider: {cfg.provider}")


# =============================================================================
# Prompt Factory
# =============================================================================

class PromptFactory:
    @staticmethod
    def system_summarize() -> str:
        return (
            "You are a careful medical/technical summarizer. "
            "Produce faithful, concise summaries. Preserve key facts, units, and numbers."
        )

    @staticmethod
    def user_summarize(text: str, style: Literal["abstractive","extractive"]="abstractive", length: Literal["short","medium","long"]="medium") -> str:
        return (
            f"Summarize the following content.\n"
            f"Style: {style}\n"
            f"Target length: {length}\n\n"
            f"CONTENT:\n{text}"
        )

    @staticmethod
    def system_qa() -> str:
        return (
            "You are a precise question-answering assistant. "
            "Only answer using the provided context. If insufficient, say you do not have enough information."
        )

    @staticmethod
    def user_qa(question: str, context: str) -> str:
        return (
            f"Question: {question}\n"
            f"Use ONLY this context:\n{context}\n"
            f"Answer with a direct, concise response. If context is insufficient, state that."
        )

    @staticmethod
    def system_entities() -> str:
        return (
            "You are a clinical NLP extractor. Extract entities and return STRICT JSON with these keys:\n"
            "problems[], medications[], allergies[], procedures[], tests[], dates[], clinicians[]. "
            "Each item must be an object with text and any relevant attributes (e.g., dose, route, frequency)."
        )

    @staticmethod
    def user_entities(text: str) -> str:
        return f"Extract entities from the following text and output valid JSON only:\n\n{text}"

    @staticmethod
    def system_note() -> str:
        return (
            "You are a clinical documentation assistant. Generate a structured SOAP note JSON.\n"
            "Return STRICT JSON with keys: subjective, objective, assessment[], plan[], "
            "icd10_codes[], snomed_codes[], medications_to_start[], follow_up[]."
        )

    @staticmethod
    def user_note(transcript: str, chart_context: Optional[str]) -> str:
        return (
            "From the patient-clinician transcript (and chart context if provided), "
            "generate a high-quality SOAP note in STRICT JSON.\n\n"
            f"TRANSCRIPT:\n{transcript}\n\n"
            f"CHART_CONTEXT:\n{chart_context or '(none)'}"
        )

    @staticmethod
    def system_introduction() -> str:
        return (
            "Extract user details and return valid JSON object only. "
            "Rules:\n"
            "- Use only explicitly stated information\n"
            '- All values must be strings (age as "25" not 25)\n'
            '- Missing info = empty string ""\n'
            "- Additional details go in other_details as key-value pairs\n"
            "- Return JSON only, no markdown"
        )

    @staticmethod
    def user_introduction(user_input: str, json_schema_example: Dict[str, Any]) -> str:
        return (
            f'Input: "{user_input}"\n'
            "Required output format (fill missing with empty strings):\n"
            f"{json.dumps(json_schema_example, ensure_ascii=False)}"
        )


# =============================================================================
# LLM Service (reusable)
# =============================================================================

class LLMService:
    def __init__(self, cfg: ProviderConfig):
        self.cfg = cfg
        self.client = build_llm_client(cfg)

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        response_format: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> LLMResponse:
        messages = [
            LLMMessage(role="system", content=system_prompt),
            LLMMessage(role="user", content=user_prompt),
        ]
        return await self.client.acomplete(messages, response_format=response_format, **kwargs)


# =============================================================================
# FastAPI App & Schemas
# =============================================================================

app = FastAPI(title="LLM Augmented Docs API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ALLOW_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cfg = ProviderConfig()
llm_service = LLMService(cfg)
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

# ---- Session stores (simple in-memory demo) ---------------------------------
session_contexts: Dict[str, Any] = {}
session_histories: Dict[str, List[Dict[str, Any]]] = {}

# ---- Common Models -----------------------------------------------------------

class HealthResponse(BaseModel):
    status: str
    provider: str
    model: str

class ErrorResponse(BaseModel):
    detail: str

class JsonResponse(BaseModel):
    data: Optional[Dict[str, Any]] = None
    status: int = 200

# ---- New Endpoint Models ----------------------------------------------------

class SummarizeRequest(BaseModel):
    text: str
    style: Literal["abstractive","extractive"] = "abstractive"
    length: Literal["short","medium","long"] = "medium"

class SummarizeResponse(BaseModel):
    summary: str

class QARequest(BaseModel):
    question: str
    context: str

class QAResponse(BaseModel):
    answer: str
    sufficient_context: bool

class ExtractEntitiesRequest(BaseModel):
    text: str

class ExtractEntitiesResponse(BaseModel):
    entities: Dict[str, Any]  # problems, medications, etc.

class GenerateNoteRequest(BaseModel):
    transcript: str
    chart_context: Optional[str] = None

class GenerateNoteResponse(BaseModel):
    note: Dict[str, Any]  # structured SOAP JSON

# ---- Backward-compatible introduction/query models --------------------------

class IntroductionRequest(BaseModel):
    session_id: str
    user_input: str

class QueryRequest(BaseModel):
    session_id: str
    user_input: str

# Example user JSON schema
JSON_USER_FORM = {
    "name": "",
    "age": "",
    "gender": "",
    "profession": "",
    "place": "",
    "other_details": {}
}

# =============================================================================
# Routes
# =============================================================================

@app.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(status="ok", provider=cfg.provider, model=(cfg.openai_model if cfg.provider=="openai" else (cfg.hf_model or "unknown")))


@app.post("/summarize", response_model=SummarizeResponse, responses={502: {"model": ErrorResponse}})
async def summarize(req: SummarizeRequest):
    try:
        sys_p = PromptFactory.system_summarize()
        usr_p = PromptFactory.user_summarize(req.text, req.style, req.length)
        res = await llm_service.complete(sys_p, usr_p)
        return SummarizeResponse(summary=res.text.strip())
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("summarize failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/qa", response_model=QAResponse, responses={502: {"model": ErrorResponse}})
async def qa(req: QARequest):
    try:
        sys_p = PromptFactory.system_qa()
        usr_p = PromptFactory.user_qa(req.question, req.context)
        res = await llm_service.complete(sys_p, usr_p)
        text = (res.text or "").strip()
        insufficient = any(x in text.lower() for x in ["insufficient", "not enough", "cannot answer"])
        return QAResponse(answer=text, sufficient_context=not insufficient)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("qa failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/extract_entities", response_model=ExtractEntitiesResponse, responses={502: {"model": ErrorResponse}})
async def extract_entities(req: ExtractEntitiesRequest):
    try:
        sys_p = PromptFactory.system_entities()
        usr_p = PromptFactory.user_entities(req.text)
        res = await llm_service.complete(
            sys_p,
            usr_p,
            response_format={"type": "json_object"}
        )
        # Fallback if model returns plain text JSON
        parsed = None
        try:
            parsed = json.loads(res.text)
        except Exception:
            # Some providers put JSON in raw field; try to dig
            parsed = {"raw": res.text}
        return ExtractEntitiesResponse(entities=parsed)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("extract_entities failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate_note", response_model=GenerateNoteResponse, responses={502: {"model": ErrorResponse}})
async def generate_note(req: GenerateNoteRequest):
    try:
        sys_p = PromptFactory.system_note()
        usr_p = PromptFactory.user_note(req.transcript, req.chart_context)
        res = await llm_service.complete(
            sys_p,
            usr_p,
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=1600,
        )
        try:
            note = json.loads(res.text)
        except Exception:
            note = {"raw": res.text}
        return GenerateNoteResponse(note=note)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("generate_note failed")
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# Backward-Compatible Endpoints (from your original app)
# =============================================================================

@app.post("/introduction", response_model=JsonResponse)
async def introduction_endpoint(req: IntroductionRequest):
    try:
        sys_p = PromptFactory.system_introduction()
        usr_p = PromptFactory.user_introduction(req.user_input, JSON_USER_FORM)
        res = await llm_service.complete(
            sys_p,
            usr_p,
            response_format={"type": "json_object"},
            max_tokens=600
        )
        try:
            data = json.loads(res.text)
        except Exception:
            data = {"raw": res.text}
        return JsonResponse(data=data)
    except Exception as e:
        logger.exception("introduction failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/query", response_model=JsonResponse)
async def query(req: QueryRequest):
    """
    Preserves your previous behavior: conversational helper with optional web search (Tavily).
    Now simplified into a deterministic JSON response.
    """
    try:
        # (Optional) demonstrate a single Tavily call; adjust prompt to include links.
        # NOTE: You can gate this behind heuristics if desired.
        links: List[str] = []
        try:
            search = tavily.search(req.user_input, max_results=3)
            links = [r.get("url") for r in search.get("results", []) if r.get("url")]
        except Exception as te:
            logger.warning(f"Tavily search failed: {te}")

        sys_p = (
            "You are a professional assistant. If links are provided, weave them into the response as evidence. "
            "Return STRICT JSON with keys: response (string), support_links (array of strings)."
        )
        usr_p = (
            f"User question: {req.user_input}\n"
            f"These links may help:\n{json.dumps(links)}\n\n"
            "Return JSON only."
        )
        res = await llm_service.complete(
            sys_p,
            usr_p,
            response_format={"type": "json_object"},
            max_tokens=600
        )
        try:
            parsed = json.loads(res.text)
        except Exception:
            parsed = {"response": res.text, "support_links": links}
        return JsonResponse(data=parsed)
    except Exception as e:
        logger.exception("query failed")
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# Startup & main
# =============================================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True, log_level=os.getenv("LOG_LEVEL", "info"))
