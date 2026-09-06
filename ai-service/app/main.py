from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.triage import router as triage_router

app = FastAPI(
    title="Swasth Setu - AI Triage & Urgency Scoring Microservice",
    version="1.0.0",
    description="Deterministic rule-based clinical triage engine for rural healthcare routing (SIH 2026). Strictly non-diagnostic.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(triage_router)

@app.get("/", tags=["Health & Status"])
async def root():
    return {
        "service": "Swasth Setu AI Triage Microservice",
        "status": "online",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/health", tags=["Health & Status"])
async def health_check():
    return {"status": "healthy", "service": "ai-triage-service"}
