from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

from .object_id import PyObjectId
from .participant_model import ParticipantModel

# collection: "wheels"
class WheelModel(BaseModel):
    title: str
    participants: List[ParticipantModel]
    rate_of_effect: float
    last_spun_at: Optional[datetime] = None

    id: PyObjectId = Field(alias="_id")
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
