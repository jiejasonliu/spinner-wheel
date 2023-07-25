from dotenv import dotenv_values
from os import getenv
from pymongo import MongoClient


class DbContextManager:
    def __init__(self):
        self.client = MongoClient(getenv("MONGODB_CONNECTION_URI"))
        self.db = self.client[getenv("DB_NAME")]

    def __enter__(self):
        return self.db

    def __exit__(self, exc_type, exc_value, traceback):
        self.client.close()


async def get_db():
    with DbContextManager() as db:
        yield db
