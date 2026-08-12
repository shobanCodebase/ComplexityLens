from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models.schemas
import services.analyzer_service as analyzer_service

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
    try:
        return analyzer_service.run_full_analysis(request.code, request.language, request.input_size)
    except SyntaxError as e:
        raise HTTPException(status_code=400, detail=f"Could not parse code as valid Python: {str(e)}")


@app.post("/compare", response_model=models.schemas.CompareResponse)
async def compare(request: models.schemas.CompareRequest):
    results = []
    for item in request.items:
        try:
            analysis = analyzer_service.run_full_analysis(item.code, item.language, request.input_size)
            results.append(models.schemas.CompareResultItem(
                name=item.name, success=True, result=analysis, error=None
            ))
        except SyntaxError as e:
            results.append(models.schemas.CompareResultItem(
                name=item.name, success=False, result=None, error=f"Could not parse code: {str(e)}"
            ))

    return models.schemas.CompareResponse(results=results)