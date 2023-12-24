from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from .object_id import PyObjectId
from .participant_model import ParticipantModel

# collection: "histories"
class HistoryModel(BaseModel):
    wheel_id: PyObjectId
    winner: ParticipantModel
    time: datetime

    id: PyObjectId = Field(alias="_id")
    model_config = ConfigDict(arbitrary_types_allowed=True)

