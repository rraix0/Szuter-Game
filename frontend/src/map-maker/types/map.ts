export type MapLayerType = "background" | "blocks";

export type MapData = {
  background: (string | null)[][];
  blocks: (string | null)[][];
};

export type MapConfig = {
  name: string;
  width: number;
  height: number;
};