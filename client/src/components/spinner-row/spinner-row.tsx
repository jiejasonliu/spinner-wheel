import { useState } from "react";
import { EditSpinnerPopup } from "@/components/_popups/edit-spinner-popup/edit-spinner-popup";
import { DeleteSpinnerPopup } from "@/components/_popups/delete-spinner-popup/delete-spinner-popup";
import { WheelSpinner } from "@/components/wheel-spinner/wheel-spinner";
import { Wheel } from "@/models/wheel";
import "./spinner-row.scss";

export interface SpinnerRowProps {
  wheel: Wheel;
  onRowClicked: () => void;
}

export const SpinnerRow = ({ wheel, onRowClicked }: SpinnerRowProps) => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  return (
    <>
      <div className="c-spinner-row" onClick={onRowClicked}>
        <div className="tiny-wheel">
          <WheelSpinner
            dimensions={{ w: 100, h: 100 }}
            segments={wheel.participants}
          />
        </div>
        <div className="title">{wheel.title}</div>
        <button className="action-button" onClick={(e) => handleEditClick(e)}>
          Edit
        </button>
        <button className="action-button" onClick={(e) => handleDeleteClick(e)}>
          Delete
        </button>
      </div>

      <EditSpinnerPopup
        wheel={wheel}
        showing={showEditPopup}
        onClose={() => setShowEditPopup(false)}
      />
      <DeleteSpinnerPopup
        wheelId={wheel._id}
        showing={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
      />
    </>
  );

  function handleEditClick(e: React.MouseEvent) {
    e.stopPropagation();
    setShowEditPopup(true);
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setShowDeletePopup(true);
  }
};
