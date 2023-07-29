import { useMemo, useState } from "react";
import { useSetRecoilState } from "recoil";
import { PopupModal } from "@/components/popup-modal/popup-modal";
import { UpdateWheel, Wheel, isValidRateOfEffect } from "@/models/wheel";
import { getWheelsClient } from "@/services/wheels-client";
import { wheelsState } from "@/state/wheels-atom";
import "./edit-spinner-popup.scss";

export interface EditSpinnerPopupProps {
  wheel: Wheel;
  showing: boolean;
  onClose: () => void;
}

// title: str
// rate_of_effect: float
export const EditSpinnerPopup = ({
  wheel,
  showing,
  onClose,
}: EditSpinnerPopupProps) => {
  const [title, setTitle] = useState(wheel.title);
  const [rateOfEffect, setRateOfEffect] = useState(
    wheel.rate_of_effect.toString()
  );
  const [loading, setLoading] = useState(false);

  const setWheels = useSetRecoilState(wheelsState);
  const wheelsClient = useMemo(getWheelsClient, []);

  return (
    <PopupModal
      headerLabel={"Edit Spinner"}
      showing={showing}
      onClose={onClose}
    >
      <div className="edit-spinner-popup-content">
        <div className="label-and-input-container">
          <div className="label">Spinner Title</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        <div className="label-and-input-container">
          <div className="label">Rate of Range (0-1)</div>
          <input
            className={isValidRateOfEffect(rateOfEffect) ? "" : "error-input"}
            value={rateOfEffect}
            onChange={(e) => setRateOfEffect(e.target.value)}
          ></input>
        </div>
        <button
          className="confirm-button"
          disabled={!isReadyToUpdate() || loading}
          onClick={handleEditConfirm}
        >
          Confirm
        </button>
      </div>
    </PopupModal>
  );

  function isReadyToUpdate(): boolean {
    if (
      title === wheel.title &&
      rateOfEffect === wheel.rate_of_effect.toString()
    ) {
      return false;
    }
    return !!title && isValidRateOfEffect(rateOfEffect);
  }

  async function handleEditConfirm() {
    if (!isReadyToUpdate()) {
      return;
    }

    const updateWheelInfo: UpdateWheel = {
      title: title,
      rate_of_effect: parseFloat(rateOfEffect),
    };

    setLoading(true);
    const updatedWheel = await wheelsClient.updateWheelById(
      wheel._id,
      updateWheelInfo
    );
    setLoading(false);
    
    setWheels((wheels) =>
      wheels.map((existingWheel) =>
        existingWheel._id === wheel._id ? updatedWheel : existingWheel
      )
    );
    onClose();
  }
};
