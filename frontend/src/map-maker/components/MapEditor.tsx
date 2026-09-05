import { useState } from "react";

import type { MapConfig } from "../types/map";

import MapCanvas from "./MapCanvas";
import Toolbar from "./Toolbar";

type MapEditorProps = {
  config: MapConfig;
};



export default function MapEditor({
  config,
}: MapEditorProps) {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4 shadow-2xl shadow-black/40">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-300">
              {config.name}.csv
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Map editor
            </p>
          </div>

          <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
            {config.width} × {config.height}
          </span>
        </div>

        <div className="flex gap-6">
          <div className="shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-2xl shadow-black/40">
            <Toolbar 
              selectedObject={selectedObject}
              onSelectObject={setSelectedObject}
            />
          </div>

          <div className="min-w-0 flex-1 overflow-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/40">
            <MapCanvas
              width={config.width}
              height={config.height}
              selectedObject={selectedObject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}