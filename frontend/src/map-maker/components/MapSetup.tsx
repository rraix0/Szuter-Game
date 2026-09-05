import { useState } from "react";

import type { MapConfig } from "../types/map";

type MapSetupProps = {
  onCreate: (config: MapConfig) => void;
};

export default function MapSetup({ onCreate }: MapSetupProps) {
  const [name, setName] = useState("");
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(300);

  const handleCreate = () => {
    if (!name.trim()){
      return;
    }

    if (width <= 0 || height <= 0) {
      return;
    }

    onCreate({ 
      name, 
      width, 
      height 
    });
  }

  return (
    <div className="flex flex-row min-h-screen justify-center items-center bg-zinc-950">
      <div className="w-xl h-200 bg-zinc-900 border border-zinc-800 rounded-4xl block p-8 text-zinc-50 shadow-2xl shadow-black/40">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-300">Szuter | Map editor</h1>
        <p className="text-zinc-400 mt-2 text-sm">Create a new map configuration</p>
        <br/>
        <div className="flex flex-col gap-2">
          <label htmlFor="map-name" className="text-sm font-medium text-zinc-300">
            Map name
          </label>
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Map name..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-50 placeholder:text-zinc-600 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50 hover:border-zinc-700" id="map-name"/>
        </div>
        <br/>
        <div className="flex flex-col gap-2">
          <label htmlFor="map-width" className="text-sm font-medium text-zinc-300">
            Map width
          </label>
          <input type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))} placeholder="Map width..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-50 placeholder:text-zinc-600 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50 hover:border-zinc-700" id="map-width"/>
        </div>
        <br/>
        <div className="flex flex-col gap-2">
          <label htmlFor="map-height" className="text-sm font-medium text-zinc-300">
            Map height
          </label>
          <input type="number" value={height} onChange={(event) => setHeight(Number(event.target.value))} placeholder="Map height..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-50 placeholder:text-zinc-600 outline-none transition focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50 hover:border-zinc-700" id="map-height"/>
        </div>

        <br/>

        <button type="button" onClick={handleCreate} disabled={!name.trim() || width <= 0 || height <= 0} className="w-full rounded-xl bg-zinc-50 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500">
          Create
        </button>
      </div>  
    </div>
  );
}