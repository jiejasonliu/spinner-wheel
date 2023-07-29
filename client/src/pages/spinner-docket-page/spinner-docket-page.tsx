import { useMemo, useRef, useState } from "react";
import "./spinner-docket-page.scss";
import { TEST_WHEEL } from "@/models/wheel";
import { SpinnerRow } from "@/components/spinner-row/spinner-row";
import { NewSpinnerPopup } from "@/components/spinner-row/new-spinner-popup/new-spinner-popup";

export const SpinnerDocketPage = () => {
  const [showNewSpinnerPopup, setShowNewSpinnerPopup] = useState(false);

  return (
    <>
      <div className="spinner-docket">
        <div className="spinner-header">
          <h1>Bingo Crew Spinners</h1>
          <button className="create-new-button" onClick={handleNewSpinnerClick}>
            New Spinner
          </button>
        </div>
        <div className="spinner-row">
          <SpinnerRow
            title={"Bingo Crew"}
            participants={TEST_WHEEL.participants}
          />
        </div>
        <div className="spinner-row">
          <SpinnerRow
            title={TEST_WHEEL.title}
            participants={TEST_WHEEL.participants}
          />
        </div>
        <div className="spinner-row">
          <SpinnerRow
            title={TEST_WHEEL.title}
            participants={TEST_WHEEL.participants}
          />
        </div>
      </div>

      <NewSpinnerPopup
        showing={showNewSpinnerPopup}
        onClose={() => setShowNewSpinnerPopup(false)}
      />
    </>
  );

  function handleNewSpinnerClick() {
    setShowNewSpinnerPopup(true);
  }
};
