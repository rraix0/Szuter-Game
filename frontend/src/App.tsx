import { Routes, Route } from "react-router-dom";

import GameApp from "./game/GameApp";
import MapMakerApp from "./map-maker/MapMakerApp";
import ObjectManagerApp from "./object-manager/ObjectManagerApp";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GameApp />} />
      <Route path="/map-maker" element={<MapMakerApp />} />
      <Route path="/object-manager" element={<ObjectManagerApp/>} />
    </Routes>
  );
}