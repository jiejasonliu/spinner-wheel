import { PopupModal } from "@/components/popup-modal/popup-modal";
import "./edit-spinner-popup.scss";

export interface EditSpinnerPopupProps {
  showing: boolean;
  onClose: () => void;
}

// title: str
// rate_of_effect: float
export const EditSpinnerPopup = ({
  showing,
  onClose,
}: EditSpinnerPopupProps) => {
  return (
    <PopupModal
      headerLabel={"Edit Spinner"}
      showing={showing}
      onClose={onClose}
    >
      <div className="edit-spinner-popup-content">
        <div className="label-and-input-container">
          <div className="label">Spinner Title</div>
          <input></input>
        </div>
        <div className="label-and-input-container">
          <div className="label">Rate of Range (0-1)</div>
          <input></input>
        </div>
        <button className="confirm-button">Confirm</button>
      </div>
    </PopupModal>
  );
};
