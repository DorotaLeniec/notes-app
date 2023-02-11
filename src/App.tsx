import React, { useEffect, useState } from "react";
import Note from "./components/Note";
interface INote {
  id: string;
  body: string;
}
function App() {
  const [notes, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    const getNotes = async () => {
      const res = await fetch("https://challenge.surfe.com/dorka/notes", {
        method: "GET",
      });
      const data = await res.json();
      console.log("data", data);
      setNotes(data);
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
      {notes.map((n) => (
        <Note description={n.body} />
      ))}
    </div>
  );
}

export default App;
