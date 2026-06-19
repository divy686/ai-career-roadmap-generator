import os
import logging
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
import bcrypt
import jwt
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
from groq import AsyncGroq
from prompt import ROADMAP_PROMPT_MARKDOWN

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Enterprise AI Career Planner API", version="4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
db_client = AsyncIOMotorClient(MONGO_URI)
db = db_client["ai_career_planner"]

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
ai_client = AsyncGroq(api_key=GROQ_API_KEY)

JWT_SECRET = os.getenv("JWT_SECRET", "fallback-secret-key-change-this")
JWT_ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_jwt_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user_id(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token session.")
        return user_id
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired or invalid token.")

class UserAuth(BaseModel):
    email: EmailStr
    password: str

class RoadmapRequest(BaseModel):
    current_role: str
    skills: str
    target_role: str
    time_commitment: str

@app.post("/auth/register")
async def register(user_data: UserAuth):
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Account with this email already exists.")
    
    new_user = {
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "created_at": datetime.utcnow()
    }
    result = await db.users.insert_one(new_user)
    token = create_jwt_token(str(result.inserted_id))
    return {"token": token, "email": user_data.email}

@app.post("/auth/login")
async def login(user_data: UserAuth):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials provided.")
    
    token = create_jwt_token(str(user["_id"]))
    return {"token": token, "email": user["email"]}

async def stream_and_save_roadmap(prompt_content: str, user_id: str, metadata: dict):
    complete_text = ""
    try:
        subscription = await ai_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt_content}],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            stream=True,
        )
        async for chunk in subscription:
            content = chunk.choices[0].delta.content
            if content:
                complete_text += content
                yield content

        await db.roadmaps.insert_one({
            "user_id": user_id,
            "target_role": metadata["target_role"],
            "current_role": metadata["current_role"],
            "content": complete_text,
            "created_at": datetime.utcnow()
        })
    except Exception as e:
        logger.error(f"Execution Error: {str(e)}")
        yield f"\n\n❌ [Runtime Error]: Generation failed. Details: {str(e)}"

@app.post("/roadmap-generate")
async def generate_roadmap(roadmap_input: RoadmapRequest, token: str):
    user_id = await get_current_user_id(token)
    
    raw_prompt = ROADMAP_PROMPT_MARKDOWN
    formatted_prompt = (
        raw_prompt.replace("{current_role}", roadmap_input.current_role)
                  .replace("{skills}", roadmap_input.skills)
                  .replace("{target_role}", roadmap_input.target_role)
                  .replace("{time_commitment}", roadmap_input.time_commitment)
    )

    metadata = {"target_role": roadmap_input.target_role, "current_role": roadmap_input.current_role}
    return StreamingResponse(stream_and_save_roadmap(formatted_prompt, user_id, metadata), media_type="text/plain")

@app.get("/roadmaps/history")
async def get_history(token: str):
    user_id = await get_current_user_id(token)
    cursor = db.roadmaps.find({"user_id": user_id}).sort("created_at", -1)
    history = []
    async for document in cursor:
        history.append({
            "id": str(document["_id"]),
            "target_role": document["target_role"],
            "current_role": document["current_role"],
            "content": document["content"],
            "created_at": document["created_at"].strftime("%Y-%m-%d %H:%M")
        })
    return {"history": history}

@app.delete("/roadmaps/{roadmap_id}")
async def delete_roadmap(roadmap_id: str, token: str):
    user_id = await get_current_user_id(token)

    await db.roadmaps.delete_one({
        "_id": ObjectId(roadmap_id),
        "user_id": user_id
    })

    return {"message": "Roadmap deleted successfully"}