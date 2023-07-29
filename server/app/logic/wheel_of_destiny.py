import math
import pdb

from numpy import random
from typing import List

from ..models.wheels_model import ParticipantModel


def update_weighted_choices(participants: List[ParticipantModel], winner: str, alpha: float = 0.25) -> List[ParticipantModel]:
    """
    Arguments:
        [participants]: list of participants to update weights for
        [winner]: name of one of the participants to decrease weight for
        [alpha]: rate of effect; increase or decrease to make weight change more drastic
    """
    participant_names = [p['name'] for p in participants]
    if winner not in participant_names:
        raise Exception(f"{winner} must be in {participant_names}")

    non_normalized_participants = [
        {
            'name': p['name'],
            'weight': p['weight'] * math.exp(-alpha) if p['name'] == winner else p['weight'] * math.exp(alpha)
        }
        for p in participants
    ]

    total_weights = sum(p['weight'] for p in non_normalized_participants)
    normalized_participants = [
        {
            'name': p['name'],
            'weight': round(p['weight'] / total_weights, 3)
        }
        for p in non_normalized_participants
    ]
    return normalized_participants
