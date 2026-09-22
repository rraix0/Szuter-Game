import { useState } from "react";

import type { MapConfig } from "../../types/mapData";

type MapSetupProps = {
  onCreate: (config: MapConfig) => void;
};

export default function MapSetup({ onCreate }: MapSetupProps) {
  const [name, setName] = useState("");
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(300);

  const createMap = () => {
    if (!name.trim()) {
      return;
    }

    if (width <= 0 || height <= 0) {
      return;
    }

    onCreate({
      name: name.trim(),
      width,
      height
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 sm:p-6">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-50 shadow-2xl shadow-black/40 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-200 sm:text-3xl">
          Szuter | Map Editor
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Create a new map configuration
        </p>

        <div className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="map-name"
              className="text-sm font-medium text-zinc-300"
            >
              Map name
            </label>

            <input
              id="map-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Map name..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-50 placeholder:text-zinc-600 outline-none transition hover:border-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="map-width"
                className="text-sm font-medium text-zinc-300"
              >
                Width
              </label>

              <input
                id="map-width"
                type="number"
                min="1"
                value={width}
                onChange={(event) =>
                  setWidth(Number(event.target.value))
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-50 outline-none transition hover:border-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="map-height"
                className="text-sm font-medium text-zinc-300"
              >
                Height
              </label>

              <input
                id="map-height"
                type="number"
                min="1"
                value={height}
                onChange={(event) =>
                  setHeight(Number(event.target.value))
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-50 outline-none transition hover:border-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={createMap}
            disabled={
              !name.trim() ||
              width <= 0 ||
              height <= 0
            }
            className="w-full cursor-pointer rounded-xl bg-zinc-50 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            Create map
          </button>
        </div>
      </div>
    </div>
  );
}