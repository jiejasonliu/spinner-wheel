from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI
from .routers import wheels_router

load_dotenv(find_dotenv())

app = FastAPI()
# register any routers
app.include_router(wheels_router.router)

@app.get("/", tags=["Root"])
async def hello():
    return {'hello world from': 'bingo-crew-spinner-api'}