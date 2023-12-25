export interface Wheel {
  _id: string;
  title: string;
  participants: Participant[];
  rate_of_effect: number;
  last_spun_at: string | null;
}

export interface Participant {
  name: string;
  weight: number;
}

export type CreateWheel = {
  title: string;
  rate_of_effect: number;
  participant_names: string[];
};

export type UpdateWheel = {
  title: string;
  rate_of_effect: number;
};

export type UpdateWheelWinner = {
  winner: string;
};

export function isValidRateOfEffect(rateOfEffect: string): boolean {
  const rateOfEffectNumber = parseFloat(rateOfEffect);
  if (isNaN(rateOfEffectNumber)) {
    return false;
  }
  return rateOfEffectNumber >= 0.0 && rateOfEffectNumber <= 1.0;
}

export function isValidParticipantsList(commaDelimitedNames: string) {
  return /[a-zA-Z0-9\s]+(,[a-zA-Z0-9\s])*/.test(commaDelimitedNames);
}
