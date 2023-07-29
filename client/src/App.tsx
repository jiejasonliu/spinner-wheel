import { Route } from "react-router-dom";
import "./App.scss";
import { Routes } from "react-router";
import { SpinnerRoomPage } from "@/pages/spinner-room-page/spinner-room-page";
import { SpinnerDocketPage } from '@/pages/spinner-docket-page/spinner-docket-page';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<SpinnerDocketPage />} />
        <Route path="/spinner/:id" element={<SpinnerRoomPage />} />
      </Routes>
    </div>
  );
}

export default App;
