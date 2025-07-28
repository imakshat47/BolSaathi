from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib

app = FastAPI()

# Allow CORS for your frontend (update with Render frontend domain if needed)
origins = [
    "https://your-frontend.onrender.com"  # replace with actual Render frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[*],  # domains that can access this backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data model for request
class SignupRequest(BaseModel):
    name: str
    password: str

# POST endpoint for signup
@app.post("/signup")
def signup(user: SignupRequest):
    # Hash the password
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    
    # Print/log it for demo (in production you would save to a DB)
    print(f"✅ New user signed up: {user.name} | Hashed password: {hashed_password}")
    
    # Send back confirmation
    return {"message": "Signup successful"}
