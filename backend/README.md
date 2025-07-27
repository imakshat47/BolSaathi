# Intervu.AI
A voice first, context aware,  agentic interview coach  powered by LangChain and  LLMs

# Initial Set-up
- Install Requirements
```python
python -m vevn venv
venv\Scripts\activate
pip install -r requirements.txt
```

# To Run the server
```python 
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```