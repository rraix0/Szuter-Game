import type { MapData, MapLayerType } from "../types/map";
import type { Dispatch, SetStateAction } from "react";

type MapCanvasProps = {
  width: number;
  height: number;
  layer: MapLayerType;
  selectedObject: string | null;
  mapData: MapData;
  setMapData: Dispatch<SetStateAction<MapData>>;
};


export default function MapCanvas({ width, height, layer, selectedObject, mapData, setMapData}: MapCanvasProps) {
  const handleCellClick = (index: number, value: string | null) => {
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


  return(
    <div className="grid" onContextMenu={(event) => event.preventDefault()} style={{
        gridTemplateColumns: `repeat(${width}, 16px)`,
        gridTemplateRows: `repeat(${height}, 16px)`,
      }}>
        {Array.from(
          { length: width * height},
          (_, index) => {
            
          const x = index % width;
          const y = Math.floor(index / width);
          const value = mapData[layer][y][x];
          
          return(
              <div key={index} onClick={() => handleCellClick(index, selectedObject)} onContextMenu={(event) => {event.preventDefault(); handleCellClick(index, null)}} className="w-4 h-4 border border-solid border-zinc-800 box-border">
                {value}
              </div>
            );
          }
        )}
    </div>
  );
}