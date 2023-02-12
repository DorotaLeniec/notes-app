import { DragEvent, useEffect, useState } from "react";
import Note from "./components/Note";
import { v4 as uuidv4 } from "uuid";
import { User } from "./types";
import Notee from "./components/Notee";

export interface INote {
  id?: number;
  body?: string;
  isNew?: boolean;
}
function App() {
  const [notes, setNotes] = useState<INote[]>([]);
  const [commonUsers, setCommonUsers] = useState<User[]>([]);

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

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch(
        `https://challenge.surfe.com/users/mostMentioned`
      );
      const data = await res.json();
      setCommonUsers(data);
    };
    try {
      getUsers();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, email: string) => {
    e.dataTransfer.setData("mention", email);
  };

  return (
    <div className="bg-blue-50 p-5  flex">
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
        <div className="p-2">Recently mentioned:</div>
        <div className="text-sm p-2 text-black flex flex-col gap-2">
          {commonUsers.map((u) => {
            return (
              <div
                key={uuidv4()}
                draggable
                onDragStart={(e) => handleDragStart(e, u.email)}
                className="px-2 cursor-pointer rounded text-blue-600 bg-white shadow-xl shadow-gray-50 hover:shadow-2xl hover:transition"
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

      <div className="flex gap-10 flex-wrap w-full bg-blue-300">
        {notes.map((n) => (
          <Notee key={uuidv4()} {...n} />
        ))}
      </div>
    </div>
  );
}

export default App;
