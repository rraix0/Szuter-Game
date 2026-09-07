import { useState } from "react";

import type {
  MapConfig,
  MapData,
  MapLayerType
} from "../types/map";

import MapCanvas from "./MapCanvas";
import Toolbar from "./Toolbar";

type MapEditorProps = {
  config: MapConfig;
};

export default function MapEditor({
  config
}: MapEditorProps) {
  const [layer, setLayer] =
    useState<MapLayerType>("background");

  const [selectedObject, setSelectedObject] =
    useState<string | null>(null);

  const [mapData, setMapData] = useState<MapData>(() => ({
    background: Array.from(
      { length: config.height },
      () => Array(config.width).fill(null)
    ),
    blocks: Array.from(
      { length: config.height },
      () => Array(config.width).fill(null)
    )
  }));

  const exportMap = () => {
    const background = mapData.background.map(
      (row) =>
        `[${row
          .map((cell) => cell === null ? "null" : cell)
          .join(",")}]`
    );

    const blocks = mapData.blocks.map(
      (row) =>
        `[${row
          .map((cell) => cell === null ? "null" : cell)
          .join(",")}]`
    );

    const content = [
      `${config.width}x${config.height}`,
      `${config.name}.csv:`,
      "{",
      "background",
      "[",
      ...background.map((row) => `  ${row},`),
      "],",
      "",
      "blocks",
      "[",
      ...blocks.map((row) => `  ${row},`),
      "]",
      "}"
    ].join("\n");

    const file = new Blob(
      [content],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${config.name}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-3 text-zinc-300 sm:p-6">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 shadow-2xl shadow-black/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-zinc-200 sm:text-2xl">
              {config.name}.csv
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Map editor
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
              {config.width} × {config.height}
            </span>

            <button
              type="button"
              onClick={exportMap}
              className="cursor-pointer rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.98]"
            >
              Export
            </button>
          </div>
        </div>

        <div className="grid min-h-0 grid-cols-1 gap-4 lg:grid-cols-[208px_minmax(0,1fr)] lg:gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-2xl shadow-black/40">
            <Toolbar
              layer={layer}
              onLayerChange={setLayer}
              selectedObject={selectedObject}
              onSelectObject={setSelectedObject}
            />
          </div>

          <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 shadow-2xl shadow-black/40 sm:p-4">
            <MapCanvas
              width={config.width}
              height={config.height}
              layer={layer}
              selectedObject={selectedObject}
              mapData={mapData}
              setMapData={setMapData}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-2xl shadow-black/40 sm:p-5">
          <h2 className="text-sm font-semibold text-zinc-200">
            Controls
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <span className="text-sm font-medium text-zinc-300">
                Left click
              </span>

              <p className="mt-1 text-sm text-zinc-500">
                Place selected object
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <span className="text-sm font-medium text-zinc-300">
                Left drag
              </span>

              <p className="mt-1 text-sm text-zinc-500">
                Place multiple objects
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <span className="text-sm font-medium text-zinc-300">
                Right click / drag
              </span>

              <p className="mt-1 text-sm text-zinc-500">
                Remove one or multiple objects
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <span className="text-sm font-medium text-zinc-300">
                + / -
              </span>

              <p className="mt-1 text-sm text-zinc-500">
                Zoom around cursor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}