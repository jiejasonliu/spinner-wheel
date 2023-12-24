from pydantic import BaseModel

class ParticipantModel(BaseModel):
    name: str
    weight: float
