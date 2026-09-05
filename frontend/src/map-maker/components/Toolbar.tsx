import { event } from "@tauri-apps/api";
import { useState } from "react";


export default function Toolbar() {
  const [layer, setlayer] = useState("background");

  return (
    <aside className="flex w-52 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="layer" className="text-sm font-medium text-zinc-300">
          Layer
        </label>

        <select id="layer" value={layer} onChange={(event) => setlayer(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-50 outline-none transition hover:border-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50">
          <option value="background">
            Background
          </option>

          <option value="blocks">
            Blocks
          </option>
        </select>
      </div>

      <div className="h-px bg-zinc-800"/>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-zinc-300">
          Blocks
        </span>

        <button type="button" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-left text-sm text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200">
          Empty
        </button>
      </div>
    </aside>
  );
}