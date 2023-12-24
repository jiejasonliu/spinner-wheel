from bson import ObjectId
from datetime import datetime
from fastapi import APIRouter, Body, Depends, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from pymongo import MongoClient, ReturnDocument
from typing import List

from ..db.db_context import get_db
from ..limit import FIND_LIMIT
from ..logic.wheel_of_destiny import update_weighted_choices
from ..models.histories_collection import HistoryModel
from ..models.participant_model import ParticipantModel
from ..models.wheels_collection import WheelModel, CreateWheelModel, UpdateWheelModel, UpdateWheelWinnerModel

router = APIRouter(
    prefix='/wheels',
)


@router.get('/', response_description='list all wheels', response_model=List[WheelModel])
def get_wheels(request: Request, db: MongoClient = Depends(get_db)):
    wheels = db["wheels"].find(limit=FIND_LIMIT)
    wheels_list = list(wheels)
    return wheels_list


@router.get('/{wheel_id}', response_description='get wheel by id', response_model=WheelModel)
def get_wheel_by_id(wheel_id: str, request: Request, db: MongoClient = Depends(get_db)):
    if not ObjectId.is_valid(wheel_id):
        raise HTTPException(
            status_code=404, detail=f"{wheel_id} is not a valid bson.ObjectId")

    wheel = db["wheels"].find_one(
        {"_id": ObjectId(wheel_id)},
    )
    if wheel is None:
        raise HTTPException(
            status_code=404, detail=f"Could not find wheel with id of {wheel_id}")
    return wheel


@router.post("/", response_description='create a wheel', status_code=status.HTTP_201_CREATED, response_model=WheelModel)
def create_wheel(request: Request, wheel: CreateWheelModel = Body(...), db: MongoClient = Depends(get_db)):
    wheel = jsonable_encoder(wheel)
    participant_names = jsonable_encoder(wheel['participant_names'])

    # list({ name: str, weight: int })
    weight = 1 / len(participant_names)
    participants: List[ParticipantModel] = [
        {'name': name, 'weight': weight}
        for name in participant_names
    ]

    new_wheel = db["wheels"].insert_one(
        {
            'title': wheel['title'],
            'rate_of_effect': wheel['rate_of_effect'],
            'participants': participants,
        }
    )

    created_wheel_json = db["wheels"].find_one({
        "_id": new_wheel.inserted_id
    })
    return created_wheel_json


@router.delete("/{wheel_id}", response_description='delete wheel', response_model=WheelModel)
def delete_wheel(wheel_id: str, request: Request, db: MongoClient = Depends(get_db)):
    if not ObjectId.is_valid(wheel_id):
        raise HTTPException(
            status_code=404, detail=f"{wheel_id} is not a valid bson.ObjectId")

    deleted_wheel = db["wheels"].find_one_and_delete(
        {"_id": ObjectId(wheel_id)}
    )
    if deleted_wheel is None:
        raise HTTPException(
            status_code=404, detail=f"Could not delete wheel with id of {wheel_id}")

    # Delete all histories related to this wheel
    db["histories"].delete_many({
        "wheel_id": ObjectId(wheel_id)
    })

    return deleted_wheel


@router.put("/{wheel_id}", response_description='update wheel information', response_model=WheelModel)
def update_wheel(wheel_id: str, request: Request, payload: UpdateWheelModel = Body(...), db: MongoClient = Depends(get_db)):
    if not ObjectId.is_valid(wheel_id):
        raise HTTPException(
            status_code=404, detail=f"{wheel_id} is not a valid bson.ObjectId")

    payload = jsonable_encoder(payload)
    updated_wheel = db["wheels"].find_one_and_update(
        {"_id": ObjectId(wheel_id)},
        {
            "$set":
            {
                "title": payload['title'],
                "rate_of_effect": payload['rate_of_effect']
            }
        },
        return_document=ReturnDocument.AFTER
    )
    if updated_wheel is None:
        raise HTTPException(
            status_code=404, detail=f"Could not update wheel with id of {wheel_id}")
    return updated_wheel


@router.patch("/{wheel_id}/winner", response_description='update wheel winner to update weights', response_model=WheelModel)
def update_wheel_winner(wheel_id: str, request: Request, payload: UpdateWheelWinnerModel = Body(...), db: MongoClient = Depends(get_db)):
    if not ObjectId.is_valid(wheel_id):
        raise HTTPException(
            status_code=404, detail=f"{wheel_id} is not a valid bson.ObjectId")

    payload = jsonable_encoder(payload)
    wheel = db["wheels"].find_one(
        {"_id": ObjectId(wheel_id)},
    )
    if wheel is None:
        raise HTTPException(
            status_code=404, detail=f"Could not find wheel with id of {wheel_id} to update")

    spin_time = datetime.utcnow()
    updated_wheel = db["wheels"].find_one_and_update(
        {"_id": ObjectId(wheel_id)},
        {
            "$set":
            {
                "participants": update_weighted_choices(wheel['participants'], payload['winner'], wheel['rate_of_effect']),
                "last_spun_at": spin_time,
            }
        },
        return_document=ReturnDocument.AFTER
    )
    if updated_wheel is None:
        raise HTTPException(
            status_code=404, detail=f"Could not update wheel winner with id of {wheel_id}")

    # Add to history of winners
    winner_from_old_wheel = next((p for p in wheel["participants"] if p['name'] == payload['winner']), None)
    if winner_from_old_wheel is None:
         raise HTTPException(
            status_code=404, detail=f"Failed to find player with name of {payload['winner']} after updating the wheel")

    new_history = db["histories"].insert_one(
        {
            "wheel_id": updated_wheel['_id'],
            "winner": winner_from_old_wheel,
            "time": spin_time,
        }
    )
    if new_history is None:
        raise HTTPException(
            status_code=404, detail=f"Could not add new history for {wheel_id}")
    return updated_wheel
