import { useMemo, useRef, useState } from "react";
import "./spinner-docket-page.scss";
import { TEST_WHEEL } from "@/models/wheel";
import { SpinnerRow } from "@/components/spinner-row/spinner-row";

export const SpinnerDocketPage = () => {
  return (
    <div className="spinner-docket">
      <div className="spinner-header">
        <h1>Bingo Crew Spinners</h1>
        <button className="create-new-button">Create New</button>
      </div>
      <div className="spinner-row">
        <SpinnerRow
          title={'Bingo Crew'}
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
  );
};
