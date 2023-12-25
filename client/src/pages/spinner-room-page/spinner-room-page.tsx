import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import triangleIcon from "@/assets/svgs/triangle.svg";
import { DropdownContent } from "@/components/dropdown-content/dropdown-content";
import { StatsTable } from "@/components/stats-table/stats-table";
import {
  WheelSpinner,
  WheelSpinnerForwardRef,
} from "@/components/wheel-spinner/wheel-spinner";
import * as audio from "@/helpers/audio";
import { toHumanReadableDate } from "@/helpers/date";
import { Wheel, UpdateWheelWinner } from "@/models/wheel";
import { getWheelsClient } from "@/services/wheels-client";
import { wheelsState } from "@/state/wheels-atom";
import { SpinHistory } from "./spin-history/spin-history";
import "./spinner-room-page.scss";

export const SpinnerRoomPage = () => {
  const [wheel, setWheel] = useState<Wheel | undefined>(undefined);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const spinHistoryButtonRef = useRef(null);
  const wheelSpinnerRef = useRef<WheelSpinnerForwardRef>(null);

  const [wheels, setWheels] = useRecoilState(wheelsState);
  const wheelsClient = useMemo(getWheelsClient, []);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!params.id) {
        return;
      }
      const localWheel = wheels.find((w) => w._id === params.id);
      if (localWheel) {
        setWheel(localWheel);
      } else {
        const remoteWheel = await wheelsClient.getWheelById(params.id);
        setWheel(remoteWheel);
      }
    })();
  }, [wheels]);

  if (!wheel) {
    return null;
  }

  return (
    <div className="spinner-room">
      <div className="room-details">
        <div className="title" onClick={navigateHome}>
          {wheel.title}
        </div>
        <div className="detail">
          <span className="label">Rate of Effect: </span>
          {wheel.rate_of_effect}
        </div>
        <div className="detail">
          <span className="label">Last Spun: </span>
          <div>
            <span>
              {wheel.last_spun_at
                ? toHumanReadableDate(wheel.last_spun_at)
                : "Never"}
            </span>
            <DropdownContent
              className="spin-history-dropdown-content"
              show={isHistoryOpen}
              outsideClickExclusions={[spinHistoryButtonRef]}
              onOutsideClick={() => setIsHistoryOpen(false)}
            >
              <SpinHistory wheelId={wheel._id}></SpinHistory>
            </DropdownContent>
          </div>
          <button
            className={`spin-history-button ${isHistoryOpen ? 'open' : ''}`}
            onClick={toggleHistory}
            ref={spinHistoryButtonRef}
          >
            <span className="history-icon">🛈</span>
          </button>
        </div>
      </div>
      <div className="spinner-details">
        <div className="spinner">
          <WheelSpinner
            ref={wheelSpinnerRef}
            segments={wheel.participants}
            onCrossSegment={handleCrossSegment}
            onSpinFinished={handleSpinFinished}
          />
          <div className="triangle">
            <img src={triangleIcon} className="triangle" alt="triangle icon" />
          </div>
        </div>
        <div className="stats-container">
          <div className="header">Probabilities</div>
          <StatsTable entries={wheel.participants} />
          <button
            className="spin-button"
            disabled={isSpinning}
            onClick={spinWheel}
          >
            Spin
          </button>
        </div>
      </div>
    </div>
  );

  function spinWheel() {
    wheelSpinnerRef.current?.startSpin();
    setIsSpinning(true);
  }

  function toggleHistory(event: React.MouseEvent) {
    event.stopPropagation();
    setIsHistoryOpen((previousValue) => !previousValue);
  }

  function navigateHome() {
    navigate("/");
  }

  async function handleCrossSegment() {
    audio.playDing();
  }

  async function handleSpinFinished(winnerName: string) {
    if (!wheel?._id) {
      return;
    }

    audio.playApplause(50);

    const updatedWheelWinnerInfo: UpdateWheelWinner = {
      winner: winnerName,
    };
    const wheelWithUpdatedWinner = await wheelsClient.updateWheelWinner(
      wheel._id,
      updatedWheelWinnerInfo
    );

    // upsert wheel locally after a delay
    setTimeout(() => {
      const hasWheelInLocalState = wheels.find(
        (localWheel) => localWheel._id === wheelWithUpdatedWinner._id
      );
      if (hasWheelInLocalState) {
        setWheels((wheels) =>
          wheels.map((localWheel) => {
            if (localWheel._id === wheelWithUpdatedWinner._id) {
              return wheelWithUpdatedWinner;
            }
            return localWheel;
          })
        );
      } else {
        setWheels((localWheels) => [wheelWithUpdatedWinner, ...localWheels]);
      }

      setIsSpinning(false);
    }, 1500);
  }
};
