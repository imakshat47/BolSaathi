from __future__ import annotations as _annotations
import uvicorn
import asyncio
import os
import uuid
from dotenv import load_dotenv
import json
from pydantic import BaseModel, ValidationError
from tavily import TavilyClient
from typing import Dict, Any, Optional
from openai import AsyncOpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from agents import (
    OpenAIChatCompletionsModel, Agent,
    HandoffOutputItem, ItemHelpers, MessageOutputItem,
    RunContextWrapper, Runner,
    ToolCallItem, ToolCallOutputItem, TResponseInputItem,
    function_tool, handoff, trace,
    set_tracing_disabled
)
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX
# logger
import logging
logger = logging.getLogger(__name__)
# Disbale warnings
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Load environment variables
print(load_dotenv())
set_tracing_disabled(disabled=True)
# Key
groq_base_url = os.environ.get("GROQ_OPENAI_BASE_URL")
groq_api_key = os.environ.get("GROQ_API_KEY")
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY "))

model = "deepseek-r1-distill-llama-70b"
model = "meta-llama/llama-4-maverick-17b-128e-instruct"

custom_model = OpenAIChatCompletionsModel(
    model=model,
    openai_client=AsyncOpenAI(base_url=groq_base_url, api_key=groq_api_key)
)

# Context
class IntroductionAgentContext(BaseModel):    
    user_input: str | None
    context: list[str] = []

class QueryRequest(BaseModel):
    session_id: str
    user_input: str

class IntroductionRequest(BaseModel):
    session_id: str
    user_input: str

class JsonResponse(BaseModel):
    data: Optional[Dict[str, Any]] = None
    status: int = 200

session_contexts= {}
session_inputs: dict[str, list[TResponseInputItem]] = {}
session_histories = {}

### TOOLS
# Tool to search government scheme info
@function_tool(
    name_override="gov_scheme_search",
    description_override="Search for relevant government schemes using question and personal context."
)
async def search_scheme_tool(question: str, context: str) -> str:
    query = f"{question}. User context: {context}"
    resp = tavily.get_search_context(query="What happened during the Burning Man floods?")
    return resp
    resp = tavily.search(query)
    # Extract top 3 results
    items = resp.get("results", [])[:3]
    summary = "\n".join(f"- {i.get('title')}: {i.get('content')[:200]}..." for i in items)
    urls = "\n".join(i.get("url", "") for i in items)
    return f"Search Results:\n{summary}\nLinks:\n{urls}"

json_user_form = {
    'name': '',
    'age': '',
    'gender': '',
    'profession': '',
    'place': '',
    'other detials': {},
}

### AGENT
introduction_agent = Agent[IntroductionAgentContext](    
    name="Introduction Agent",
    model=custom_model,
    handoff_description="An intelligent agent that extracts details from user introduction.",
    instructions=f"""{RECOMMENDED_PROMPT_PREFIX}
    Extract user details and return valid JSON object only.        
    Rules:
    - Use only explicitly stated information
    - All values must be strings (age as "25" not 25)
    - Missing info = empty string ""
    - Additional details go in other_details as key-value pairs
    - Return JSON only, no markdown, no explanations, no <think> tags

    Output: Only JSON object body
    """,
    tools=[],
)

chat_agent = Agent(
    name="chat Agent",
    model=custom_model,
    # tools=[search_scheme_tool],
    # handoff_description="This agent chats candidates and also helps search government schemes.",
    instructions=f"""{RECOMMENDED_PROMPT_PREFIX}
    You are a professional assistant capable of real-time web search and reasoning using tools.
    Your goal: help users find relevant government schemes based on their personal context (e.g., age, location, profession).
  
    **Instruction Flow (ReAct-style reasoning):**
    1. **Think** about whether the user’s query requires a search.
    2. If yes, **call** `gov_scheme_search` with a concise query combining the question and user context.
    3. **Observe** the results and then construct your answer.
    4. **Decide** if further search is needed or proceed to final response.

    **IMPORTANT**: Always reply strictly in this JSON format:

    {{
      "response": "<friendly, concise reply summarizing scheme eligibility or recommendations>",
      "support_links": ["<url1>", "<url2>", ...]
    }}

    - If you used the search tool, include relevant URLs in `support_links`.
    - If no search was needed and your internal knowledge sufficed, `support_links` may be an empty array `[]`.

    Format agent responses only as JSON:
    {{
      "response": "...",
      "support_links": "...",      
    }}
    """,
)


format_agent = Agent(
    name="format Agent",
    model=custom_model,
    instructions=f"""{RECOMMENDED_PROMPT_PREFIX}
    You are a professional assistant capable of rephrasing content into well‑formatted, human‑understandable text.

Your responsibilities:
1. Accept **any type of input**—structured data, technical description, raw text, code comments, etc.
2. Rephrase and output it in a **single formatted paragraph**, using proper grammar, explanatory tone, and readable style.

    """,
)

### FASTAPI APP
app = FastAPI()
# CORS configuration
app.add_middleware(
    CORSMiddleware,         
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello there!!"}

@app.post("/query", response_model=JsonResponse)
async def query(req: QueryRequest):
    cid = req.session_id    
    context = session_contexts.get(cid, req.user_input)
    history = session_histories.get(cid, []) + [{"role":"user","content":req.user_input}]

     # Run Agent
    with trace("Chat", group_id=cid):
        result = await Runner.run(chat_agent, history, context=context, max_turns=3)    
        result = await Runner.run(format_agent, result.final_output, max_turns=3)    
    
    output_json = {
        'details': result.final_output
    }

    # Persist session state
    session_contexts[cid] = context
    session_histories[cid] = result.to_input_list()
    print(jsonable_encoder(output_json))
    return JsonResponse(data=jsonable_encoder(output_json))    

@app.post("/introduction", response_model=JsonResponse)
async def introduction_endpoint(req: IntroductionRequest):
    session_id = req.session_id
    user_input = req.user_input

    # Initialize context and history
    # context = session_contexts.get(session_id)
    # input_items = session_inputs.get(session_id, [])

    # if not input_items:
    #     # First message in the session
    #     input_items.append({"content": """
    #     Extract user details and return valid JSON object only.        
    #         Rules:
    #         - Use only explicitly stated information
    #         - All values must be strings (age as "25" not 25)
    #         - Missing info = empty string ""
    #         - Additional details go in other_details as key-value pairs
    #         - Return JSON only, no markdown, no explanations, no <think> tags
    #     Output: Only JSON object body""", "role": "assistant"})

    user_input = f"""
    Input: "{user_input}"
    Required output format:
    {json_user_form}
    """
    # input_items.append({"content": user_input, "role": "user"})    
    
    # Run Agent
    with trace("Introduction", group_id=session_id):
        result = await Runner.run(introduction_agent, user_input, max_turns=3)    
    output_json = json.loads(result.final_output)    
    print(output_json)
    # Persist session state    
    # session_inputs[session_id] = result.to_input_list()
    return JsonResponse(data=output_json)    

async def main():
    # await introduction_endpoint(IntroductionRequest(session_id="test",user_input="I'm Ramesh, male, a labor working at dhbn company, I'm 40 yrs old and lives in dhulia and very poor."))
    await query(QueryRequest(session_id="test",user_input="What government schemes are available for unemployed youth in Delhi looking to start a small business?",))

if __name__ == "__main__":
    # asyncio.run(main())
    port = int(os.environ.get('PORT', 5000))  # Use PORT environment variable or default to 4000
    uvicorn.run("app:app", host="0.0.0.0", port=port , reload=True, log_level="info")
