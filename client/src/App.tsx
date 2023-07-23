import { useRef, useState } from "react";
import triangleIcon from "./assets/triangle.svg";
import { SpinnerSegment, WheelSpinner, WheelSpinnerForwardRef } from "./components/wheel-spinner/wheel-spinner";
import "./App.scss";

const TEST_SEGMENTS: SpinnerSegment[] = [
  {name: 'Jason', weight: 0.47},
  {name: 'Swifi', weight: 0.47},
  {name: 'Hex', weight: 0.33},
]

function App() {
  const [testSegments, setTestSegments] = useState(TEST_SEGMENTS);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const wheelSpinnerRef = useRef<WheelSpinnerForwardRef>(null);


  return (
    <div className="app-container">
      <div className="spinner">
        <WheelSpinner ref={wheelSpinnerRef} segments={testSegments} onSpinFinished={handleSpinFinished} />
        <div className="triangle">
          <img src={triangleIcon} className="triangle" alt="triangle icon"/>
        </div>
      </div>
      <div className="stats">
        <div className="header">Probabilities</div>
        {testSegments.map((segment) => (
          <div className="segment-detail">
            <div className="text">{segment.name}</div>
            <div className="text">{segment.weight}</div>
          </div>
        ))}
        <button className="spin" disabled={isSpinning} onClick={spinWheel}>Spin</button>
      </div>
    </div>
  );

  function spinWheel() {
    wheelSpinnerRef.current?.startSpin();
    setIsSpinning(true);
  }

  function handleSpinFinished(name: string): void {
    setIsSpinning(false);
  }

}

export default App;
