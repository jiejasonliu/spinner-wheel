import { PopupModal } from "@/components/popup-modal/popup-modal";
import "./new-spinner-popup.scss";
import { useState } from "react";

export interface NewSpinnerPopupProps {
  showing: boolean;
  onClose: () => void;
}

export const NewSpinnerPopup = ({ showing, onClose }: NewSpinnerPopupProps) => {
  const [title, setTitle] = useState("New Spinner");
  const [rateOfEffect, setRateOfEffect] = useState("0.25");
  const [participants, setParticipants] = useState("");

  return (
    <PopupModal
      headerLabel={"Create New Spinner"}
      showing={showing}
      onClose={onClose}
    >
      <div className="new-spinner-popup-content">
        <div className="label-and-input-container">
          <div className="label">Spinner Title</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New Spinner"
          ></input>
        </div>
        <div className="label-and-input-container">
          <div className="label">Rate of Effect (0-1)</div>
          <input
            className={isValidRateOfEffect() ? '' : 'error-input'}
            value={rateOfEffect}
            onChange={(e) => setRateOfEffect(e.target.value)}
            placeholder="0.25"
          ></input>
        </div>
        <div className="add-participants-container">
          <div className="label">Participants (comma delimited)</div>
          <input
            className="participants-input"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="Person 1, Person 2, Person 3"
          ></input>
        </div>
        <button className="confirm-button" disabled={!isReadyToCreate()}>
          Confirm ({parseParticipants().length} participants)
        </button>
      </div>
    </PopupModal>
  );


  function isReadyToCreate(): boolean {
    const isDelimitedList = /[a-zA-Z\s]+(,[a-zA-Z\s])*/.test(participants);
    return !!title && isValidRateOfEffect() && isDelimitedList;
  }

  function isValidRateOfEffect(): boolean {
    const rateOfEffectNumber = parseFloat(rateOfEffect);
    if (isNaN(rateOfEffectNumber)) {
      return false;
    }
    return rateOfEffectNumber >= 0.0 && rateOfEffectNumber <= 1.0;
  }


  function parseParticipants(): string[] {
    return participants
      .split(",")
      .map((p) => p.trim())
      .filter((p) => !!p);
  }
};
