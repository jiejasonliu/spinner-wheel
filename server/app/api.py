from fastapi import FastAPI
from dotenv import dotenv_values
from pymongo import MongoClient

from .routers import wheels_router

config = dotenv_values(".env")
app = FastAPI()

# register any routers
app.include_router(wheels_router.router)

@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(config["MONGODB_CONNECTION_URI"])
    app.database = app.mongodb_client[config["DB_NAME"]]
    print("Connected to the MongoDB database!")

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()

@app.get("/", tags=["Root"])
async def hello():
    return {'hello world from': 'bingo-crew-spinner-api'}