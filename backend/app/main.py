from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from google.genai import types
import os

from app.config import settings
from app.services.gemini_service import (
    GeminiService,
    ConceptResponse,
    QuizResponse,
    TranslationResponse,
    ActivityGuideResponse,
    LessonContext
)
from app.services.safety import sanitize_input, is_curriculum_safe, build_safe_system_instruction

# Initialize FastAPI App
app = FastAPI(
    title="ClassPilot AI Backend",
    description="FastAPI Service integrated with Gemini 2.5 Flash for voice-enabled educational assistance.",
    version="1.0.0"
)

# Configure CORS
# In production, set ALLOWED_ORIGINS env var to your Vercel domain, e.g.:
# ALLOWED_ORIGINS=https://class-pilot-ai.vercel.app
# Multiple origins can be comma-separated.
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Service
gemini_service = GeminiService()

# --- Request Models ---

class ConceptRequest(BaseModel):
    concept_name: str

class QuizRequest(BaseModel):
    topic: str
    lesson_context: Optional[LessonContext] = None

class TranslationRequest(BaseModel):
    text: str
    target_lang: str = "Hinglish"  # English, Hindi, Hinglish

class ActivityRequest(BaseModel):
    topic: str
    duration_minutes: int = 5

class ChatMessage(BaseModel):
    role: str  # 'user' or 'model' / 'assistant'
    content: str

class ChatRequest(BaseModel):
    prompt: str
    history: Optional[List[ChatMessage]] = None
    lesson_context: Optional[LessonContext] = None

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app_name": "ClassPilot AI Backend",
        "mock_mode": settings.IS_MOCK_MODE
    }

@app.post("/api/concept", response_model=ConceptResponse)
def get_concept(request: ConceptRequest):
    try:
        clean_name = sanitize_input(request.concept_name)
        if not clean_name:
            raise HTTPException(status_code=400, detail="Concept name cannot be empty")
        if not is_curriculum_safe(clean_name):
            raise HTTPException(
                status_code=422,
                detail="This topic is not appropriate for a classroom context. Please ask an educational question."
            )
        return gemini_service.generate_concept(clean_name)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz", response_model=QuizResponse)
def get_quiz(request: QuizRequest):
    try:
        clean_topic = sanitize_input(request.topic)
        if not clean_topic:
            raise HTTPException(status_code=400, detail="Quiz topic cannot be empty")
        if not is_curriculum_safe(clean_topic):
            raise HTTPException(
                status_code=422,
                detail="This topic is not appropriate for a classroom context. Please ask an educational question."
            )
        return gemini_service.generate_quiz(clean_topic, request.lesson_context)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/translate", response_model=TranslationResponse)
def get_translation(request: TranslationRequest):
    try:
        clean_text = sanitize_input(request.text)
        if not clean_text:
            raise HTTPException(status_code=400, detail="Text to translate cannot be empty")
        if not is_curriculum_safe(clean_text):
            raise HTTPException(
                status_code=422,
                detail="This content is not appropriate for a classroom context."
            )
        return gemini_service.generate_translation(clean_text, request.target_lang)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/activity", response_model=ActivityGuideResponse)
def get_activity(request: ActivityRequest):
    try:
        clean_topic = sanitize_input(request.topic)
        if not clean_topic:
            raise HTTPException(status_code=400, detail="Activity topic cannot be empty")
        if not is_curriculum_safe(clean_topic):
            raise HTTPException(
                status_code=422,
                detail="This topic is not appropriate for a classroom context. Please ask an educational question."
            )
        return gemini_service.generate_activity(clean_topic, request.duration_minutes)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat(request: ChatRequest):
    """
    General chatbot endpoint for right-side panel queries.
    """
    # Sanitize and safety-check the incoming prompt
    clean_prompt = sanitize_input(request.prompt)
    if not clean_prompt:
        return {"response": "Please type a valid question."}
    if not is_curriculum_safe(clean_prompt):
        return {
            "response": "Yeh sawaal classroom ke liye appropriate nahi hai. Kripya ek educational question poochein. 🛡️"
        }
    if settings.IS_MOCK_MODE:
        prompt_lower = request.prompt.lower()
        topic_suffix = ""
        if request.lesson_context and request.lesson_context.current_topic:
            topic_suffix = f" hum {request.lesson_context.current_topic} ke baare mein seekh rahe hain."
        
        if "hello" in prompt_lower or "hi" in prompt_lower:
            reply = f"Namaste! Main ClassPilot AI hoon. Aap mujhse koi bhi scientific concept pooch sakte hain ya quiz generate karne ko bol sakte hain.{topic_suffix}"
        elif "explain" in prompt_lower or "samjhao" in prompt_lower or "batao" in prompt_lower:
            if request.lesson_context and request.lesson_context.explanation:
                reply = f"Haan bilkul! Hum {request.lesson_context.current_topic} padh rahe hain. Jaisa ki humne dekha: {request.lesson_context.explanation[:120]}... Kya main aapke liye koi naya diagram ya activity shuru karoon?"
            else:
                reply = "Aap board par topic load kar sakte hain, ya voice command se naya concept explain karwa sakte hain. Kya main aapke liye koi naya diagram ya worksheet generate karoon?"
        elif "example" in prompt_lower or "udaharan" in prompt_lower:
            if request.lesson_context and request.lesson_context.real_life_example:
                reply = f"Humne abhi discuss kiya: {request.lesson_context.real_life_example}. Iske alawa, aap is concept ko natural cycles aur experiments mein bhi dekh sakte hain."
            else:
                reply = "Aap topic load karke uske real-life examples smart board par check kar sakte hain!"
        else:
            if request.lesson_context and request.lesson_context.current_topic:
                reply = f"Aapne '{request.prompt}' pucha. Hum active lesson '{request.lesson_context.current_topic}' ke bare mein baat kar rahe hain. Is lesson ka main takeaway hai: {request.lesson_context.summary or 'Yeh science ka important concept hai.'}"
            else:
                reply = f"Aapne poocha: '{request.prompt}'. Yeh sach mein ek behad important point hai. Class ke samne isko easily discuss karne ke liye, aap board par content load kar sakte hain."
        
        return {"response": reply}
    
    # Real Gemini request
    try:
        client = gemini_service.client
        chat_contents = []
        
        # Populate history if present
        if request.history:
            for msg in request.history:
                chat_contents.append({
                    "role": "user" if msg.role == "user" else "model",
                    "parts": [{"text": msg.content}]
                })
        
        # Append the current prompt as the final user message
        chat_contents.append({
            "role": "user",
            "parts": [{"text": request.prompt}]
        })
        
        # System instructions embedded as role prompt or client config
        system_instruction = build_safe_system_instruction(
            "You are ClassPilot AI, a voice-enabled AI teaching assistant for government schools. "
            "Speak politely, use simple English and Hinglish code-switching, be classroom-appropriate, "
            "never hallucinate facts, use everyday examples, and keep responses concise (1-3 sentences max)."
        )
        
        if request.lesson_context:
            ctx = request.lesson_context
            lesson_info = f"\n\n[Current Classroom Lesson Context]:\nTopic: {ctx.current_topic or 'None'}\n"
            if ctx.explanation:
                lesson_info += f"Explanation: {ctx.explanation}\n"
            if ctx.keywords:
                lesson_info += f"Keywords: {', '.join(ctx.keywords)}\n"
            if ctx.summary:
                lesson_info += f"Summary: {ctx.summary}\n"
            if ctx.key_takeaways:
                lesson_info += f"Key Takeaways: {', '.join(ctx.key_takeaways or [])}\n"
            if ctx.flowchart_steps:
                lesson_info += f"Flowchart Steps: {', '.join(ctx.flowchart_steps or [])}\n"
            if ctx.real_life_example:
                lesson_info += f"Real-Life Example: {ctx.real_life_example}\n"
            if ctx.fun_fact:
                lesson_info += f"Fun Fact: {ctx.fun_fact}\n"
            
            system_instruction += lesson_info
        
        # Call model
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=chat_contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
                max_output_tokens=250
            )
        )
        return {"response": response.text}
    except Exception as e:
        return {"response": f"AI temporarily offline. Status: {str(e)}"}
