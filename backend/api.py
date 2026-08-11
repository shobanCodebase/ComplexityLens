from fastapi import APIRouter, FastAPI

app = FastAPI()
router = APIRouter()

app.include_router(router)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the API!"}   

@app.get("/health")
async def read_health():
    return {"status": "ok"}