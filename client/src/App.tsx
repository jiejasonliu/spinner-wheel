import { Route } from "react-router-dom";
import "./App.scss";
import { Routes } from "react-router";
import { SpinnerRoomPage } from "@/pages/spinner-room-page/spinner-room-page";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/spinner/:id" element={<SpinnerRoomPage />} />
      </Routes>
    </div>
  );
}

export default App;
