import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import triangleIcon from "@/assets/svgs/triangle.svg";
import { StatsTable } from "@/components/stats-table/stats-table";
import {
  WheelSpinner,
  WheelSpinnerForwardRef,
} from "@/components/wheel-spinner/wheel-spinner";
import { getWheelsClient } from "@/services/wheels-client";
import { wheelsState } from "@/state/wheels-atom";
import "./spinner-room-page.scss";
import { Wheel } from "@/models/wheel";

export const SpinnerRoomPage = () => {
  const [wheel, setWheel] = useState<Wheel | undefined>(undefined);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const wheels = useRecoilValue(wheelsState);
  const wheelSpinnerRef = useRef<WheelSpinnerForwardRef>(null);

  const wheelsClient = useMemo(getWheelsClient, []);
  const params = useParams();

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
  }, []);

  if (!wheel) {
    return null;
  }

  return (
    <div className="spinner-room">
      <div className="spinner">
        <WheelSpinner
          ref={wheelSpinnerRef}
          segments={wheel.participants}
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
  );

  function spinWheel() {
    wheelSpinnerRef.current?.startSpin();
    setIsSpinning(true);
  }

  function handleSpinFinished(name: string): void {
    console.log("wheel landed on", name);
    setIsSpinning(false);
  }
};
