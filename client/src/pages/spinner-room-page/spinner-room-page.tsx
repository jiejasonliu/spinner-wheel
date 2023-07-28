import { useRef, useState } from "react";
import triangleIcon from "@/assets/triangle.svg";
import {
  SpinnerSegment,
  WheelSpinner,
  WheelSpinnerForwardRef,
} from "@/components/wheel-spinner/wheel-spinner";
import { StatsTable } from "@/components/stats-table/stats-table";
import "./spinner-room-page.scss";

const TEST_SEGMENTS: SpinnerSegment[] = [
  { name: "Jason", weight: 0.47 },
  { name: "Swifi", weight: 0.47 },
  { name: "Hex", weight: 0.33 },
];

export const SpinnerRoomPage = () => {
  const [testSegments, setTestSegments] = useState(TEST_SEGMENTS);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const wheelSpinnerRef = useRef<WheelSpinnerForwardRef>(null);

  return (
    <div className="spinner-room">
      <div className="spinner">
        <WheelSpinner
          ref={wheelSpinnerRef}
          segments={testSegments}
          onSpinFinished={handleSpinFinished}
        />
        <div className="triangle">
          <img src={triangleIcon} className="triangle" alt="triangle icon" />
        </div>
      </div>
      <div className="stats-container">
        <div className="header">Probabilities</div>
        <StatsTable
          entries={testSegments.map((s) => ({ name: s.name, value: s.weight }))}
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
