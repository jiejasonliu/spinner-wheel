import { useRef, useState } from "react";
import triangleIcon from "@/assets/svgs/triangle.svg";
import {
  WheelSpinner,
  WheelSpinnerForwardRef,
} from "@/components/wheel-spinner/wheel-spinner";
import { StatsTable } from "@/components/stats-table/stats-table";
import { TEST_WHEEL } from '@/models/wheel';
import "./spinner-room-page.scss";

export const SpinnerRoomPage = () => {
  const [testWheel, setTestWheel] = useState(TEST_WHEEL);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const wheelSpinnerRef = useRef<WheelSpinnerForwardRef>(null);

  return (
    <div className="spinner-room">
      <div className="spinner">
        <WheelSpinner
          ref={wheelSpinnerRef}
          segments={testWheel.participants}
          onSpinFinished={handleSpinFinished}
        />
        <div className="triangle">
          <img src={triangleIcon} className="triangle" alt="triangle icon" />
        </div>
      </div>
      <div className="stats-container">
        <div className="header">Probabilities</div>
        <StatsTable
          entries={testWheel.participants}
        />
        <button className="spin-button" disabled={isSpinning} onClick={spinWheel}>
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
