import { useState, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { PopupModal } from "@/components/popup-modal/popup-modal";
import { getWheelsClient } from "@/services/wheels-client";
import { wheelsState } from "@/state/wheels-atom";
import "./delete-spinner-popup.scss";

export interface DeleteSpinnerPopupProps {
  wheelId: string;
  showing: boolean;
  onClose: () => void;
}

export const DeleteSpinnerPopup = ({
  wheelId,
  showing,
  onClose,
}: DeleteSpinnerPopupProps) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const setWheels = useSetRecoilState(wheelsState);
  const wheelsClient = useMemo(getWheelsClient, []);

  return (
    <PopupModal
      headerLabel={"Delete Spinner"}
      showing={showing}
      onClose={onClose}
    >
      <div className="delete-spinner-popup-content">
        <div className="text-container">
          <div>Are you sure you want to delete this spinner?</div>
          <div>
            {" "}
            Type <span className="delete-emphasis">delete</span> to confirm the
            deletion.
          </div>
        </div>

        <input value={text} onChange={(e) => setText(e.target.value)}></input>
        <button
          className="confirm-button"
          disabled={!canDelete() || loading}
          onClick={handleDeleteConfirm}
        >
          Delete
        </button>
      </div>
    </PopupModal>
  );

  function canDelete() {
    return text.toLowerCase() === "delete";
  }

  async function handleDeleteConfirm() {
    if (!canDelete()) {
      return;
    }

    setLoading(true);
    const deletedWheel = await wheelsClient.deleteWheelById(wheelId);
    setLoading(false);

    setWheels((wheels) =>
      wheels.filter((wheel) => wheel._id !== deletedWheel._id)
    );
    onClose();
  }
};
