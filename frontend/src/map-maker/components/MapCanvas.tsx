import { useEffect, useRef, useState } from "react";

import type { MapData, MapLayerType } from "../../types/mapData";

import type { Dispatch, SetStateAction } from "react";

type MapCanvasProps = {
  width: number;
  height: number;
  layer: MapLayerType;
  selectedObject: string | null;
  mapData: MapData;
  setMapData: Dispatch<SetStateAction<MapData>>;
};

const names: Record<string, string> = {
  "0A1": "Dirt",
  "0A2": "Dirt variant",
  "0B1": "Concrete",
  "0B2": "Damaged concrete",
  "1A1": "Wooden crate",
  "1A2": "Damaged wooden crate",
};

export default function MapCanvas({
  width,
  height,
  layer,
  selectedObject,
  mapData,
  setMapData
}: MapCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [erasing, setErasing] = useState(false);

  const areaRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const cellSize = 16 * zoom;

  const setCell = (index: number, value: string | null) => {
    const x = index % width;
    const y = Math.floor(index / width);

    setMapData((currentMap) => ({
      ...currentMap,
      [layer]: currentMap[layer].map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          rowIndex === y && cellIndex === x
            ? value
            : cell
        )
      )
    }));
  };

  const paint = (index: number) => {
    if (erasing) {
      setCell(index, null);
      return;
    }

    if (selectedObject !== null) {
      setCell(index, selectedObject);
    }
  };

  const zoomMap = (amount: number) => {
    const area = areaRef.current;

    if (!area) {
      return;
    }

    const oldZoom = zoom;
    const newZoom = Math.min(
      4,
      Math.max(0.5, oldZoom + amount)
    );

    if (newZoom === oldZoom) {
      return;
    }

    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;

    const mapX =
      (area.scrollLeft + mouseX) / (16 * oldZoom);

    const mapY =
      (area.scrollTop + mouseY) / (16 * oldZoom);

    setZoom(newZoom);

    requestAnimationFrame(() => {
      area.scrollLeft =
        mapX * 16 * newZoom - mouseX;

      area.scrollTop =
        mapY * 16 * newZoom - mouseY;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomMap(0.1);
      }

      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomMap(-0.1);
      }
    };

    const handleMouseUp = () => {
      setDrawing(false);
      setErasing(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [zoom]);

  return(
    <div
      ref={areaRef}
      className="h-[60vh] min-h-80 w-full overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 select-none"
      onMouseMove={(event) => {
        const area = areaRef.current;

        if (!area) {
          return;
        }

        const rect = area.getBoundingClientRect();

        mouseRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div
        className="grid w-max"
        style={{
          gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
        }}
      >
        {Array.from(
          { length: width * height },
          (_, index) => {
            const x = index % width;
            const y = Math.floor(index / width);
            const value = mapData[layer][y][x];

            return(
              <div
                key={index}
                onMouseDown={(event) => {
                  event.preventDefault();

                  if (event.button === 0) {
                    setDrawing(true);
                    setErasing(false);
                    paint(index);
                  }

                  if (event.button === 2) {
                    setDrawing(true);
                    setErasing(true);
                    setCell(index, null);
                  }
                }}
                onMouseEnter={() => {
                  if (drawing) {
                    paint(index);
                  }
                }}
                onContextMenu={(event) => {
                  event.preventDefault();
                }}
                className={`flex cursor-pointer items-center justify-center border box-border overflow-hidden text-center transition-colors ${
                  value
                    ? "border-zinc-600 bg-zinc-700 text-zinc-200"
                    : "border-zinc-900 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900"
                }`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  fontSize: Math.max(7, cellSize * 0.35),
                  lineHeight: 1,
                }}
              >
                {value ? names[value] : ""}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}