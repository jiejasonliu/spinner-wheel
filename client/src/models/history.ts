import { Participant } from "./wheel";

export interface HistoryModel {
  wheel_id: string;
  winner: Participant;
  time: string;
}
