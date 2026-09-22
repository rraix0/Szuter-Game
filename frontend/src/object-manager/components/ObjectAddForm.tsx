import { FormEvent, useState } from "react";
import { Object } from "../types/object";

type ObjectAddFormProps = {
  onCreate: (object: Object) => void;
};

const API_URL = import.meta.env.VITE_APP_URL;

export default function ObjectAddForm({ onCreate }: ObjectAddFormProps) {
  const [data, setData] = useState<number[] | null>(null);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [strength, setStrength] = useState("");
  const [shootBy, setShootBy] = useState<boolean | null>(null);
  const [walkOn, setWalkOn] = useState<boolean | null>(null);

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!data || shootBy === null || walkOn === null) return;

    const response = await fetch(`${API_URL}/create_object`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data,
        group,
        name,
        shoot_by: shootBy,
        strength: strength ? Number(strength) : null,
        walk_on: walkOn
      })
    });

    if (!response.ok) return;

    const object: Object = await response.json();

    onCreate(object);

    setData(null);
    setName("");
    setGroup("");
    setStrength("");
    setShootBy(null);
    setWalkOn(null);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    const result = await generateThumbnailArray(file);

    setData(result);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-50 shadow-2xl shadow-black/40 sm:p-6">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-200 sm:text-2xl">
        Szuter | Object Editor
      </h1>

      <p className="mt-1.5 text-xs text-zinc-500">
        Create a new map object
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="object-data" className="text-xs font-medium text-zinc-300">
            Object data
          </label>

          <label htmlFor="object-data" className="group flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950 px-3 py-5 text-center hover:border-zinc-500 hover:bg-zinc-900">
            <span className="text-xs font-medium text-zinc-300">
              {data ? "Image selected" : "Choose object data"}
            </span>

            <span className="mt-1 text-[11px] text-zinc-600">
              Click to select a file
            </span>

            <input id="object-data" type="file" accept="image/*" required={!data} onChange={(event) => handleFile(event.target.files?.[0])} className="sr-only" />
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="object-name" className="text-xs font-medium text-zinc-300">
            Object name
          </label>

          <input id="object-name" type="text" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Object name..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="object-group" className="text-xs font-medium text-zinc-300">
            Group
          </label>

          <input id="object-group" type="text" value={group} onChange={(event) => setGroup(event.target.value)} required placeholder="Object group..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="object-strength" className="text-xs font-medium text-zinc-300">
            Strength
          </label>

          <input id="object-strength" type="number" value={strength} onChange={(event) => setStrength(event.target.value)} min="0" placeholder="25" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50" />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-medium text-zinc-300">
            Shoot by
          </legend>

          <div className="grid grid-cols-2 gap-2">
            <label className="cursor-pointer">
              <input type="radio" name="shoot_by" checked={shootBy === true} onChange={() => setShootBy(true)} required className="peer sr-only" />
              <div className="flex justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-500 peer-checked:border-zinc-400 peer-checked:bg-zinc-800 peer-checked:text-zinc-50">
                True
              </div>
            </label>

            <label className="cursor-pointer">
              <input type="radio" name="shoot_by" checked={shootBy === false} onChange={() => setShootBy(false)} className="peer sr-only" />
              <div className="flex justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-500 peer-checked:border-zinc-400 peer-checked:bg-zinc-800 peer-checked:text-zinc-50">
                False
              </div>
            </label>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-medium text-zinc-300">
            Walk on
          </legend>

          <div className="grid grid-cols-2 gap-2">
            <label className="cursor-pointer">
              <input type="radio" name="walk_on" checked={walkOn === true} onChange={() => setWalkOn(true)} required className="peer sr-only" />
              <div className="flex justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-500 peer-checked:border-zinc-400 peer-checked:bg-zinc-800 peer-checked:text-zinc-50">
                True
              </div>
            </label>

            <label className="cursor-pointer">
              <input type="radio" name="walk_on" checked={walkOn === false} onChange={() => setWalkOn(false)} className="peer sr-only" />
              <div className="flex justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-500 peer-checked:border-zinc-400 peer-checked:bg-zinc-800 peer-checked:text-zinc-50">
                False
              </div>
            </label>
          </div>
        </fieldset>

        <button type="submit" className="mt-1 w-full cursor-pointer rounded-xl bg-zinc-50 px-3 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
          Create object
        </button>
      </div>
    </form>
  );
}