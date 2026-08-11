from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models.schemas

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the API!"}

@app.get("/health")
async def read_health():
    return {"status": "ok"}

@app.post("/analyze", response_model=models.schemas.AnalyzeResponse)
async def analyze(request: models.schemas.AnalyzeRequest):
    return models.schemas.AnalyzeResponse(
        language=request.language,
        execution_time_ms=1.24,
        operation_count=4001,
        complexity="O(n)",
        memory_usage_mb=2.31,
    )