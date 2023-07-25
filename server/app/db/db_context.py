from dotenv import dotenv_values
from pymongo import MongoClient

config = dotenv_values(".env")


class DbContextManager:
    def __init__(self):
        self.client = MongoClient(config["MONGODB_CONNECTION_URI"])
        self.db = self.client[config["DB_NAME"]]

    def __enter__(self):
        return self.db

    def __exit__(self, exc_type, exc_value, traceback):
        self.client.close()


async def get_db():
    with DbContextManager() as db:
        yield db
