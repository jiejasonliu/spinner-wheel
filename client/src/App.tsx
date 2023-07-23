import { useState } from "react";
import reactLogo from "./assets/react.svg";
import triangleIcon from "./assets/triangle.svg";
import viteLogo from "/vite.svg";
import { WheelSpinner } from "./components/wheel-spinner/wheel-spinner";
import "./App.scss";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="spinner">
        <WheelSpinner />
        <div className="triangle">
          <img src={triangleIcon} className="triangle" alt="triangle icon" />
        </div>
      </div>
    </>
  );
}

export default App;
