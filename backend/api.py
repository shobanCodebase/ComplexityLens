from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models.schemas
import analyzer.complexity
import analyzer.operation_counter
import analyzer.sandbox
import analyzer.empirical

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROWTH_CURVE_INPUT_SIZES = [10, 100, 500, 1000, 5000]

@app.get("/")
async def read_root():
    return {"message": "Welcome to the API!"}

@app.get("/health")
async def read_health():
    return {"status": "ok"}

@app.post("/analyze", response_model=models.schemas.AnalyzeResponse)
async def analyze(request: models.schemas.AnalyzeRequest):
    try:
        op_counts = analyzer.operation_counter.count_operations(request.code, request.input_size)
        total_operations = sum(op_counts.values())
        complexity = analyzer.complexity.estimate_complexity(request.code)
        growth_data = analyzer.empirical.collect_operation_data(request.code, GROWTH_CURVE_INPUT_SIZES)
    except SyntaxError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not parse code as valid Python: {str(e)}"
        )

    sandbox_result = analyzer.sandbox.run_in_sandbox(request.code)
    execution_time_ms = sandbox_result["execution_time_ms"] or 0.0
    memory_usage_mb = sandbox_result["memory_usage_mb"] or 0.0

    return models.schemas.AnalyzeResponse(
        language=request.language,
        execution_time_ms=execution_time_ms,
        operation_count=total_operations,
        complexity=complexity,
        memory_usage_mb=memory_usage_mb,
        growth_data=growth_data,
    )