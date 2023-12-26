import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Loading } from "@/components/loading/loading";
import { NewSpinnerPopup } from "@/components/_popups/new-spinner-popup/new-spinner-popup";
import { SpinnerRow } from "@/components/spinner-row/spinner-row";
import { getWheelsClient } from "@/services/wheels-client";
import { wheelsState } from "@/state/wheels-atom";
import "./spinner-docket-page.scss";

const MIN_DATE = new Date(-8640000000000000);

export const SpinnerDocketPage = () => {
  const [showNewSpinnerPopup, setShowNewSpinnerPopup] = useState(false);
  const [wheelsLoaded, setWheelsLoaded] = useState(false);

  const [wheels, setWheels] = useRecoilState(wheelsState);
  const wheelsClient = useMemo(getWheelsClient, []);
  const navigate = useNavigate();

  const wheelsSortedByLastSpun = [...wheels].sort((a, b) =>
    (a.last_spun_at ?? MIN_DATE) > (b.last_spun_at ?? MIN_DATE) ? -1 : 1
  );

  useEffect(() => {
    (async () => {
      const wheels = await wheelsClient.getWheels();
      setWheels(wheels);
      setWheelsLoaded(true);
    })();
  }, []);

  return (
    <>
      <div className="spinner-docket">
        <div className="spinner-header">
          <h1>Bingo Crew Spinner Docket</h1>
          <button className="create-new-button" onClick={handleNewSpinnerClick}>
            New Spinner
          </button>
        </div>
        {wheels.length ? (
          wheelsSortedByLastSpun.map((wheel) => (
            <div className="spinner-row" key={wheel._id}>
              <SpinnerRow
                wheel={wheel}
                onRowClicked={() => navigate(`/spinner/${wheel._id}`)}
              />
            </div>
          ))
        ) : wheelsLoaded ? (
          <p>There are no spinners yet. Be the first to make one!</p>
        ) : (
          <div className="loading-container">
            <Loading size="large"></Loading>
          </div>
        )}
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
