export interface Wheel {
  id: string;
  title: string;
  participants: Participant[];
  rate_of_effect: number;
  last_spun_at: Date;
}

export interface Participant {
  name: string;
  weight: number;
}

export const TEST_WHEEL: Wheel = {
  id: "123",
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
