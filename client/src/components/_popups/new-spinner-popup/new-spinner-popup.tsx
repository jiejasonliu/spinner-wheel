import { useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import { PopupModal } from "@/components/popup-modal/popup-modal";
import {
  isValidRateOfEffect,
  CreateWheel,
  isValidParticipantsList,
} from "@/models/wheel";
import { getWheelsClient } from "@/services/wheels-client";
import { wheelsState } from "@/state/wheels-atom";
import "./new-spinner-popup.scss";

export interface NewSpinnerPopupProps {
  showing: boolean;
  onClose: () => void;
}

export const NewSpinnerPopup = ({ showing, onClose }: NewSpinnerPopupProps) => {
  const [title, setTitle] = useState("New Spinner");
  const [rateOfEffect, setRateOfEffect] = useState("0.25");
  const [participants, setParticipants] = useState("");
  const [loading, setLoading] = useState(false);

  const setWheels = useSetRecoilState(wheelsState);
  const wheelsClient = useMemo(getWheelsClient, []);

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
            className={isValidRateOfEffect(rateOfEffect) ? "" : "error-input"}
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
        <button
          className="confirm-button"
          disabled={!isReadyToCreate() || loading}
          onClick={handleCreateConfirm}
        >
          Confirm ({parseParticipants().length} participants)
        </button>
      </div>
    </PopupModal>
  );

  function isReadyToCreate(): boolean {
    return (
      !!title &&
      isValidRateOfEffect(rateOfEffect) &&
      isValidParticipantsList(participants)
    );
  }

  function parseParticipants(): string[] {
    return participants
      .split(",")
      .map((p) => p.trim())
      .filter((p) => !!p);
  }

  async function handleCreateConfirm() {
    if (!isReadyToCreate()) {
      return;
    }

    const createWheelInfo: CreateWheel = {
      title: title,
      rate_of_effect: parseFloat(rateOfEffect),
      participant_names: parseParticipants(),
    };

    setLoading(true);
    const newWheel = await wheelsClient.createWheel(createWheelInfo);
    setLoading(false);

    setWheels((wheels) => [newWheel, ...wheels]);

    // reset form and close
    setTitle("New Spinner");
    setRateOfEffect("0.25");
    setParticipants("");
    onClose();
  }
};
