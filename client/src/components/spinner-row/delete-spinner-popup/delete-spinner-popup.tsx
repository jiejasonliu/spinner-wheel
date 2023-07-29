import { PopupModal } from "@/components/popup-modal/popup-modal";
import { useState } from "react";
import "./delete-spinner-popup.scss";

export interface DeleteSpinnerPopupProps {
  showing: boolean;
  onClose: () => void;
}

export const DeleteSpinnerPopup = ({
  showing,
  onClose,
}: DeleteSpinnerPopupProps) => {
  const [text, setText] = useState("");

  return (
    <PopupModal
      headerLabel={"Delete Spinner"}
      showing={showing}
      onClose={onClose}
    >
      <div className="delete-spinner-popup-content">
        <div className="text-container">
          <div>Are you sure you want to delete this spinner?</div>
          <div> Type <span className="delete-emphasis">delete</span> to confirm the deletion.</div>
        </div>

        <input value={text} onChange={(e) => setText(e.target.value)}></input>
        <button className="confirm-button" disabled={!canDelete()}>Delete</button>
      </div>
    </PopupModal>
  );

  function canDelete() {
    return text.toLowerCase() === 'delete';
  }
};
