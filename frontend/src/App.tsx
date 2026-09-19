import { Routes, Route } from "react-router-dom";

import GameApp from "./game/GameApp";
import MapMakerApp from "./map-maker/MapMakerApp";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GameApp />} />
      <Route path="/map-maker" element={<MapMakerApp />} />
    </Routes>
  );
}