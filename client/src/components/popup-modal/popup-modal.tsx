import React, { useRef } from "react";
import ReactDOM from "react-dom";
import cancelIcon from "@/assets/svgs/cancel-icon.svg";
import "./popup-modal.scss";

export interface PopupModalProps {
  children: React.ReactNode;
  headerLabel: React.ReactNode;
  showing: boolean;
  onClose: () => void;
  actuallyDestroyOnClose?: boolean;
}

export const PopupModal = ({
  children,
  headerLabel,
  showing,
  onClose,
  actuallyDestroyOnClose = false,
}: PopupModalProps) => {
  const visibleClass = showing ? "visible" : "hidden";

  if (actuallyDestroyOnClose && !showing) {
    return null;
  }

  // render onto <div id="portal"></div> instead of in parent hierarchy but still propagate events
  return ReactDOM.createPortal(
    <div className={`c-popup-modal-overlay ${visibleClass}`}>
      <div className="c-popup-modal-content">
        <div className="c-popup-modal-header">
          <span className="c-popup-modal-header-label">{headerLabel}</span>
          <img
            src={cancelIcon}
            className="c-popup-modal-cancel-icon"
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </div>,
    document.getElementById("portal")!
  );
};
