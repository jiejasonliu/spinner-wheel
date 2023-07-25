import uuid

from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

from .object_id import PyObjectId


class ParticipantModel(BaseModel):
    name: str
    weight: float


class WheelModel(BaseModel):
    id: PyObjectId = Field(alias="_id")
    title: str
    participants: List[ParticipantModel]
    rate_of_effect: float
    last_spun_at: Optional[datetime] = None

    model_config = ConfigDict(arbitrary_types_allowed=True)


class CreateWheelModel(BaseModel):
    title: str
    rate_of_effect: float
    participant_names: List[str]


class UpdateWheelModel(BaseModel):
    title: str
    rate_of_effect: float


class UpdateWheelWinnerModel(BaseModel):
    winner: str
