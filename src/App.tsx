import { DragEvent, useEffect, useState } from "react";
import Note from "./components/Note";
import { v4 as uuidv4 } from "uuid";
import { USERS } from "./types";

export interface INote {
  id?: number;
  body?: string;
  isNew?: boolean;
}
function App() {
  const [notes, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    const getNotes = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/notes`, {
        method: "GET",
      });
      const data = await res.json();
      setNotes(data.reverse());
    };

    try {
      getNotes();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, email: string) => {
    e.dataTransfer.setData("mention", email);
  };

  return (
    <div className="bg-blue-200 p-5 text-white flex">
      <div className="sticky top-0 h-screen">
        <button
          className="px-5 py-1 m-2 rounded bg-green-600 text-white"
          onClick={() => {
            const newNotes = [{ isNew: true }, ...notes];
            setNotes(newNotes);
          }}
        >
          +Add
        </button>
        <div className="text-sm w-60 h-40 p-2 m-4 text-black flex flex-col gap-2">
          {USERS.map((u) => {
            return (
              <div
                key={uuidv4()}
                draggable
                onDragStart={(e) => handleDragStart(e, u.email)}
                className="p-2 cursor-pointer rounded bg-white shadow-sm shadow-gray-600 hover:shadow-lg hover:shadow-gray-900"
              >
                {u.email}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-10 flex-wrap w-full">
        {notes.map((n) => (
          <Note key={uuidv4()} {...n} />
        ))}
      </div>
    </div>
  );
}

export default App;
