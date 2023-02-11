import { useEffect, useState } from "react";
import Note from "./components/Note";

export interface INote {
  id?: number;
  body?: string;
  isNew?: boolean;
}
function App() {
  const [notes, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    const getNotes = async () => {
      const res = await fetch("https://challenge.surfe.com/dorka/notes", {
        method: "GET",
      });
      const data = await res.json();
      setNotes(data.reverse());
    };

    try {
      console.log("getting notes");
      getNotes();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="bg-gray-900 p-5 flex gap-10 flex-wrap justify-center items-center text-white">
      <button
        className="px-5 py-1 m-5 rounded bg-green-600 text-white absolute top-0 left-0"
        onClick={() => {
          const newNotes = [{ isNew: true }, ...notes];
          setNotes(newNotes);
        }}
      >
        +Add
      </button>
      {notes.map((n, idx) => (
        <Note key={idx} {...n} />
      ))}
    </div>
  );
}

export default App;
