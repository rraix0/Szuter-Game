export default function BlockAddForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-50 shadow-2xl shadow-black/40 sm:p-6">
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

            <label htmlFor="object-data" className="group flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950 px-3 py-5 text-center transition hover:border-zinc-500 hover:bg-zinc-900">
              <div className="flex flex-col items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-zinc-500 transition group-hover:text-zinc-300" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                </svg>

                <span className="text-xs font-medium text-zinc-300">
                  Choose object data
                </span>

                <span className="text-[11px] text-zinc-600">
                  Click to select a file
                </span>
              </div>

              <input id="object-data" type="file" name="object_data" required className="sr-only" />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="object-name" className="text-xs font-medium text-zinc-300">
              Object name
            </label>

            <input id="object-name" type="text" name="object_name" required placeholder="Object name..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none transition hover:border-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="object-group" className="text-xs font-medium text-zinc-300">
              Group
            </label>

            <input id="object-group" type="text" name="object_group" required placeholder="Object group..." className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none transition hover:border-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="object-strength" className="text-xs font-medium text-zinc-300">
              Strength
            </label>

            <input id="object-strength" type="number" name="object_strength" required min="0" placeholder="25" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600 outline-none transition hover:border-zinc-700 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50" />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-xs font-medium text-zinc-300">
              Shoot by
            </legend>

            <div className="grid grid-cols-2 gap-2">
              <label className="cursor-pointer">
                <input type="radio" name="object_shoot_by" value="true" required className="peer sr-only" />
                <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300 peer-checked:border-zinc-400 peer-checked:bg-zinc-800 peer-checked:text-zinc-50 peer-checked:ring-2 peer-checked:ring-zinc-700">
                  True
                </div>
              </label>

              <label className="cursor-pointer">
                <input type="radio" name="object_shoot_by" value="false" className="peer sr-only" />
                <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300 peer-checked:border-zinc-400 peer-checked:bg-zinc-800 peer-checked:text-zinc-50 peer-checked:ring-2 peer-checked:ring-zinc-700">
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
                <input type="radio" name="object_walk_on" value="true" required className="peer sr-only" />
                <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300 peer-checked:border-zinc-400 peer-checked:bg-zinc-800 peer-checked:text-zinc-50 peer-checked:ring-2 peer-checked:ring-zinc-700">
                  True
                </div>
              </label>

              <label className="cursor-pointer">
                <input type="radio" name="object_walk_on" value="false" className="peer sr-only" />
                <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300 peer-checked:border-zinc-400 peer-checked:bg-zinc-800 peer-checked:text-zinc-50 peer-checked:ring-2 peer-checked:ring-zinc-700">
                  False
                </div>
              </label>
            </div>
          </fieldset>

          <button type="submit" className="mt-1 w-full cursor-pointer rounded-xl bg-zinc-50 px-3 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.99]">
            Create object
          </button>
        </div>
      </div>
    </div>
  );
}