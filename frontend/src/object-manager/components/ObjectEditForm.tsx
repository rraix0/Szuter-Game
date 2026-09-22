import { FormEvent, useState } from "react";
import { Object } from "../types/object";

type ObjectEditFormProps = {
  object: Object;
  onUpdate: (object: Object) => void;
  onCancel: () => void;
};

const API_URL = import.meta.env.VITE_APP_URL;

export default function ObjectEditForm({ object, onUpdate, onCancel }: ObjectEditFormProps) {
  const [data, setData] = useState(object.data);
  const [name, setName] = useState(object.name);
  const [group, setGroup] = useState(object.group);
  const [strength, setStrength] = useState(object.strength?.toString() ?? "");
  const [shootBy, setShootBy] = useState(object.shoot_by);
  const [walkOn, setWalkOn] = useState(object.walk_on);

  const generateThumbnailArray = async (file: File): Promise<number[] | null> => {
    if (!file.type.startsWith("image/")) return null;

    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target?.result as string;
      };

      reader.onerror = () => resolve(null);
      img.onerror = () => resolve(null);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return resolve(null);

        canvas.width = 50;
        canvas.height = 50;

        ctx.drawImage(img, 0, 0, 50, 50);

        canvas.toBlob(async (blob) => {
          if (!blob || blob.size > 3 * 1024) {
            resolve(null);
            return;
          }

          const buffer = await blob.arrayBuffer();

          resolve(Array.from(new Uint8Array(buffer)));
        }, "image/webp", 0.5);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    const result = await generateThumbnailArray(file);

    if (result) {
      setData(result);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch(`${API_URL}/update_object`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: object.id,
        data,
        name,
        group,
        shoot_by: shootBy,
        strength: strength ? Number(strength) : null,
        walk_on: walkOn
      })
    });

    if (!response.ok) return;

    const updatedObject: Object = await response.json();

    onUpdate(updatedObject);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-50 shadow-2xl shadow-black/40 sm:p-6">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-200 sm:text-2xl">
        Szuter | Object Editor
      </h1>

      <p className="mt-1.5 text-xs text-zinc-500">
        Edit map object
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <label htmlFor="edit-data" className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950 text-center hover:border-zinc-500">
          <span className="text-xs text-zinc-300">
            Replace object image
          </span>

          <span className="mt-1 text-[11px] text-zinc-600">
            Click to select a file
          </span>

          <input id="edit-data" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} className="sr-only" />
        </label>

        <input type="text" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Object name..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50" />

        <input type="text" value={group} onChange={(event) => setGroup(event.target.value)} required placeholder="Object group..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50" />

        <input type="number" value={strength} onChange={(event) => setStrength(event.target.value)} min="0" placeholder="Strength" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50" />

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setShootBy(true)} className={`rounded-xl border px-3 py-2.5 text-sm ${shootBy ? "border-zinc-400 bg-zinc-800 text-zinc-50" : "border-zinc-800 bg-zinc-950 text-zinc-500"}`}>
            Shoot True
          </button>

          <button type="button" onClick={() => setShootBy(false)} className={`rounded-xl border px-3 py-2.5 text-sm ${!shootBy ? "border-zinc-400 bg-zinc-800 text-zinc-50" : "border-zinc-800 bg-zinc-950 text-zinc-500"}`}>
            Shoot False
          </button>

          <button type="button" onClick={() => setWalkOn(true)} className={`rounded-xl border px-3 py-2.5 text-sm ${walkOn ? "border-zinc-400 bg-zinc-800 text-zinc-50" : "border-zinc-800 bg-zinc-950 text-zinc-500"}`}>
            Walk True
          </button>

          <button type="button" onClick={() => setWalkOn(false)} className={`rounded-xl border px-3 py-2.5 text-sm ${!walkOn ? "border-zinc-400 bg-zinc-800 text-zinc-50" : "border-zinc-800 bg-zinc-950 text-zinc-500"}`}>
            Walk False
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onCancel} className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800">
            Cancel
          </button>

          <button type="submit" className="rounded-xl bg-zinc-50 px-3 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}