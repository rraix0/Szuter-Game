import type { MapObject } from "../types/object";
import type { MapLayerType } from "../types/map";

type ToolbarProps = {
  layer: MapLayerType;
  onLayerChange: (layer: MapLayerType) => void;
  selectedObject: string | null;
  onSelectObject: (id: string) => void;
};

const objects: MapObject[] = [
  {
    code: "0A1",
    name: "Dirt",
    icon: "",
  },
  {
    code: "0A2",
    name: "Dirt variant",
    icon: "",
  },
  {
    code: "0B1",
    name: "Concrete",
    icon: "",
  },
  {
    code: "0B2",
    name: "Damaged concrete",
    icon: "",
  },
  {
    code: "1A1",
    name: "Wooden crate",
    icon: "",
  },
  {
    code: "1A2",
    name: "Damaged wooden crate",
    icon: "",
  },
];

export default function Toolbar({
  layer,
  onLayerChange,
  selectedObject,
  onSelectObject
}: ToolbarProps) {
  return (
    <aside className="flex w-52 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="layer" className="text-sm font-medium text-zinc-300">
          Layer
        </label>

        <select
          id="layer"
          value={layer}
          onChange={(event) => onLayerChange(event.target.value as MapLayerType)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-50 outline-none transition hover:border-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50"
        >
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
          {layer === "background" ? "Background" : "Blocks"}
        </span>

        {objects.map((object) => (
          <button
            key={object.code}
            type="button"
            onClick={() => onSelectObject(object.code)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
              selectedObject === object.code
                ? "border-zinc-600 bg-zinc-800 text-zinc-50"
                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            {object.name}
          </button>
        ))}
      </div>
    </aside>
  );
}