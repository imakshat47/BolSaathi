import requests

# Make a GET request
response = requests.get("http://localhost:8000/")
print(response.status_code)  # 200
print(response.json()) 

headers = {
    "Authorization": "Bearer your_token_here",
    "Content-Type": "application/json"
}

# POST with form data
queries = [
    "I am a small-scale farmer living in Uttar Pradesh, age 35. Am I eligible for any government subsidy schemes for purchasing agricultural equipment?"   ,
    "What government schemes are available for unemployed youth in Delhi looking to start a small business?",
    "I have been diagnosed with a chronic illness and earn below Rs 1 lakh annually. Are there medical support schemes I can access?",
     "As a 22-year-old student from Mumbai pursuing a B.Tech, what government scholarships or loan schemes can assist me?"
]

for query in queries:
    form_data = {"session_id": "john1", "user_input": str(query)}
    response = requests.post("http://localhost:8000/query", json=form_data, headers=headers)
    print(response.json()) 