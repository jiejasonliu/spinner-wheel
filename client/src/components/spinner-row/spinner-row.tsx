import { useState } from "react";
import { Participant } from "@/models/wheel";
import { WheelSpinner } from "../wheel-spinner/wheel-spinner";
import { EditSpinnerPopup } from "@/components/spinner-row/edit-spinner-popup/edit-spinner-popup";
import { DeleteSpinnerPopup } from "@/components/spinner-row/delete-spinner-popup/delete-spinner-popup";
import { NewSpinnerPopup } from "@/components/spinner-row/new-spinner-popup/new-spinner-popup";
import "./spinner-row.scss";

export interface SpinnerRowProps {
  title: string;
  participants: Participant[];
}

export const SpinnerRow = ({ title, participants }: SpinnerRowProps) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  return (
    <>
      <div className="c-spinner-row" onClick={handleRowClick}>
        <div className="tiny-wheel">
          <WheelSpinner
            dimensions={{ w: 100, h: 100 }}
            segments={participants}
          />
        </div>
        <div className="title">{title}</div>
        <button className="action-button" onClick={handleEditClick}>
          Edit
        </button>
        <button className="action-button" onClick={handleDeleteClick}>
          Delete
        </button>
      </div>

      <EditSpinnerPopup
        showing={showEditPopup}
        onClose={() => setShowEditPopup(false)}
      />
      <DeleteSpinnerPopup
        showing={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
      />
    </>
  );

  function handleRowClick() {}

  function handleEditClick() {
    setShowEditPopup(true);
  }

  function handleDeleteClick() {
    setShowDeletePopup(true);
  }
};
