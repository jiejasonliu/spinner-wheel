from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import histories_router, wheels_router

load_dotenv(find_dotenv())

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "https://127.0.0.1:5173",
        "http://bingo-crew-spinner.vercel.app",
        "https://bingo-crew-spinner.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# register any routers
app.include_router(histories_router.router)
app.include_router(wheels_router.router)


@app.get("/", tags=["Root"])
async def hello():
    return {'hello world from': 'bingo-crew-spinner-api'}
