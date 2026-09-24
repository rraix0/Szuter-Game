import { objectDataToImage } from "../../uitls/objectImage";
import { Object } from "../types/object";

type ObjectResultProps = {
  object: Object;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ObjectResult({ object, onEdit, onDelete }: ObjectResultProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 text-zinc-50 shadow-2xl shadow-black/40">
      <div className="flex aspect-square items-center justify-center bg-zinc-950">
        <img src={objectDataToImage(object.data)} alt={object.name} className="h-full w-full object-contain" />
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-zinc-100">
          {object.name}
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          {object.group}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <span className="text-zinc-600">Strength</span>
            <p className="mt-1 text-zinc-200">
              {object.strength ?? "None"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <span className="text-zinc-600">Shoot by</span>
            <p className="mt-1 text-zinc-200">
              {object.shoot_by ? "True" : "False"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <span className="text-zinc-600">Walk on</span>
            <p className="mt-1 text-zinc-200">
              {object.walk_on ? "True" : "False"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <span className="text-zinc-600">Data</span>
            <p className="mt-1 text-zinc-200">
              {object.data.length} bytes
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={onEdit} className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm font-medium text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-50">
            Edit
          </button>

          <button type="button" onClick={onDelete} className="cursor-pointer rounded-xl border border-red-950 bg-red-950/20 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/40">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}