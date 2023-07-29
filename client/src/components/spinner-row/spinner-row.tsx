import { Participant } from "@/models/wheel";
import "./spinner-row.scss";
import { WheelSpinner } from "../wheel-spinner/wheel-spinner";

export interface SpinnerRowProps {
  title: string;
  participants: Participant[];
}

export const SpinnerRow = ({ title, participants }: SpinnerRowProps) => {
  return (
    <div className="c-spinner-row">
      <div className="tiny-wheel">
        <WheelSpinner dimensions={{ w: 100, h: 100 }} segments={participants} />
      </div>
      <div className="title">{title}</div>
      <button className="action-button">Edit</button>
      <button className="action-button">Delete</button>
    </div>
  );
};
