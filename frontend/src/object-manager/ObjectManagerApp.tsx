import { MapObject } from "../types/mapObject";
import { useEffect, useState } from "react";
import axios from "axios";
import { base64ImgDecoder } from "../uitls/utils";

export default function ObjectManagerApp() {
  const [objects, setObjects] = useState<MapObject[]>([]);

  async function fetchObjects() {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_APP_URL + "/get_objects"
      );
      console.log("API:", response.data);
      setObjects(response.data);
    } catch (error) {
      console.error("Failed to fetch objects:", error);
    }
  }

  async function deleteObject(betterId: string) {
    try {
      const password = prompt("Give password for Authentication");

      const response = await axios.post(
        import.meta.env.VITE_API_APP_URL + "/delete_object",
        {
          id: betterId
        },
        {
          headers: {
            Authorization: password
          }
        }
      );

      if (response.status === 200) {
        setObjects((prev) =>
          prev.filter((obj) => obj.id !== betterId)
        );
      }
    } catch (error) {
      console.error("Failed to fetch objects:", error);
    }
  }

  useEffect(() => {
    fetchObjects();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-zinc-50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Object Manager</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage all objects
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950">
                  <th className="px-5 py-4 font-medium text-zinc-400">
                    Preview
                  </th>
                  <th className="px-5 py-4 font-medium text-zinc-400">
                    Name
                  </th>
                  <th className="px-5 py-4 font-medium text-zinc-400">
                    Group
                  </th>
                  <th className="px-5 py-4 font-medium text-zinc-400">
                    Shoot By
                  </th>
                  <th className="px-5 py-4 font-medium text-zinc-400">
                    Strength
                  </th>
                  <th className="px-5 py-4 font-medium text-zinc-400">
                    Walk On
                  </th>
                  <th className="px-5 py-4 text-right font-medium text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-zinc-800">
                  <td colSpan={7} className="p-3">
                    <button
                      type="button"
                      className="w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-50"
                    >
                      Add Object
                    </button>
                  </td>
                </tr>

                {objects.map((object) => (
                  <tr
                    key={object.id}
                    className="border-b border-zinc-800 transition-colors hover:bg-zinc-800/40"
                  >
                    <td className="px-5 py-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                        <img
                          src={`data:image/png;base64,${base64ImgDecoder(object.data)}`}
                          alt={object.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </td>

                    <td className="px-5 py-3 font-medium text-zinc-100">
                      {object.name}
                    </td>

                    <td className="px-5 py-3 text-zinc-400">
                      {object.group}
                    </td>

                    <td className="px-5 py-3">
                      {object.shoot_by ? "True" : "False"}
                    </td>

                    <td className="px-5 py-3 text-zinc-300">
                      {object.strength ?? "None"}
                    </td>

                    <td className="px-5 py-3">
                      {object.walk_on ? "True" : "False"}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="cursor-pointer rounded-lg border border-red-950 bg-red-950/20 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/40"
                          onClick={() => deleteObject(object.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {objects.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-zinc-500">
                No objects found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}