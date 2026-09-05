import { useState } from "react";

import type { MapConfig } from "./types/map";

import MapSetup from "./components/MapSetup";
import MapEditor from "./components/MapEditor";


export default function MapMakerApp() {
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);

  if (mapConfig === null) {
    return(
      <MapSetup onCreate={setMapConfig} />
    );
  }

  return (
    <MapSetup onCreate={setMapConfig} />
  );
}