from bson import ObjectId
from fastapi import APIRouter, Depends, Request, HTTPException
from pymongo import MongoClient
from typing import List

from ..db.db_context import get_db
from ..limit import FIND_LIMIT
from ..models.histories_collection import HistoryModel

router = APIRouter(
    prefix='/histories',
)


@router.get('/{wheel_id}', response_description='get all histories for a wheel by wheel_id', response_model=List[HistoryModel])
def get_histories_by_wheel_id(wheel_id: str, request: Request, db: MongoClient = Depends(get_db)):
    if not ObjectId.is_valid(wheel_id):
        raise HTTPException(
            status_code=404, detail=f"{wheel_id} is not a valid bson.ObjectId")

    # Sort histories in descending order by time (most recent first)
    histories = (
        db["histories"]
        .find({"wheel_id": ObjectId(wheel_id)}, limit=FIND_LIMIT)
        .sort("time", -1)
    )
    histories_list = list(histories)
    return histories_list