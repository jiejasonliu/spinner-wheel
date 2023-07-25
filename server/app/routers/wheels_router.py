from bson import ObjectId
from datetime import datetime
from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from pymongo import ReturnDocument
from typing import List

from ..logic.wheel_of_destiny import update_weighted_choices
from ..models.wheels_model import WheelModel, ParticipantModel, CreateWheelModel, UpdateWheelModel, UpdateWheelWinnerModel

router = APIRouter(
    prefix='/wheels',
)


@router.get('/', response_description='list all wheels', response_model=List[WheelModel])
def get_wheels(request: Request):
    # scale better if we exceed it in the future :P
    wheels = request.app.database["wheels"].find(limit=1000)
    wheels_list = list(wheels)
    return wheels_list


@router.post("/", response_description='create a wheel', status_code=status.HTTP_201_CREATED, response_model=WheelModel)
def create_wheel(request: Request, wheel: CreateWheelModel = Body(...)):
    wheel = jsonable_encoder(wheel)
    participant_names = jsonable_encoder(wheel['participant_names'])

    # list({ name: str, weight: int })
    weight = 1 / len(participant_names)
    participants: List[ParticipantModel] = [
        {'name': name, 'weight': weight}
        for name in participant_names
    ]

    new_wheel = request.app.database["wheels"].insert_one(
        {
            'title': wheel['title'],
            'rate_of_effect': wheel['rate_of_effect'],
            'participants': participants,
        }
    )

    created_wheel_json = request.app.database["wheels"].find_one({
        "_id": new_wheel.inserted_id
    })
    return created_wheel_json


@router.delete("/{wheel_id}", response_description='delete wheel', response_model=WheelModel)
def delete_wheel(wheel_id: str, request: Request):
    deleted_wheel = request.app.database["wheels"].find_one_and_delete(
        {"_id": ObjectId(wheel_id)}
    )
    if deleted_wheel is None:
        raise HTTPException(
            status_code=404, detail=f"Could not delete wheel with id of {wheel_id}")
    return deleted_wheel


@router.put("/{wheel_id}", response_description='update wheel information', response_model=WheelModel)
def update_wheel(wheel_id: str, request: Request, payload: UpdateWheelModel = Body(...)):
    try:
        payload = jsonable_encoder(payload)
        updated_wheel = request.app.database["wheels"].find_one_and_update(
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
        return updated_wheel
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/{wheel_id}/winner", response_description='update wheel winner to update weights', response_model=WheelModel)
def update_wheel_winner(wheel_id: str, request: Request, payload: UpdateWheelWinnerModel = Body(...)):
    payload = jsonable_encoder(payload)
    wheel = request.app.database["wheels"].find_one(
        {"_id": ObjectId(wheel_id)},
    )
    if wheel is None:
        raise HTTPException(
            status_code=404, detail=f"Could not update wheel winner with id of {wheel_id}")

    updated_wheel = request.app.database["wheels"].find_one_and_update(
        {"_id": ObjectId(wheel_id)},
        {
            "$set":
            {
                "participants": update_weighted_choices(wheel['participants'], payload['winner'], wheel['rate_of_effect']),
                "last_spun_at": datetime.utcnow(),
            }
        },
        return_document=ReturnDocument.AFTER
    )
    return updated_wheel

