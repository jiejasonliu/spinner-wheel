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

export const TEST_WHEEL: Wheel = {
  _id: "123",
  title:
    "Test wheel with three participants, rate-of-effect of 0.25, and last spun on July 1st, 2023.",
  participants: [
    { name: "Jason", weight: 0.291 },
    { name: "Swifi", weight: 0.438 },
    { name: "Hex", weight: 0.271 },
  ],
  rate_of_effect: 0.25,
  last_spun_at: new Date("July 1, 2023"),
};
