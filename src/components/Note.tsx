import { useEffect, useState } from "react";

const Note = ({
  description,
  id,
  isNew = false,
}: {
  description: string;
  id?: number;
  isNew?: boolean;
}) => {
  const [note, setNote] = useState(description);
  console.log("note", note);

  const updateNote = () => {
    const saveNewNote = async () => {
      fetch(`https://challenge.surfe.com/dorka/notes`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ body: note }),
      });
    };

    const saveNote = async () => {
      fetch(`https://challenge.surfe.com/dorka/notes/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ body: note }),
      });
    };

    try {
      console.log("saving note");
      isNew ? saveNewNote() : saveNote();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="p-2 rounded-lg w-60 h-60 border-1 border border-gray-400 bg-slate-100 text-gray-800 flex flex-col">
      <label
        htmlFor="note"
        className="block text-sm font-medium text-gray-900 dark:text-white"
      >
        Note title
      </label>
      <p className="text-gray-600 text-xs">Last updated: 18 Apr, 2023</p>
      <textarea
        id="note"
        rows={8}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mt-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Type your curent thoughts..."
      ></textarea>
      <div>
        <button
          className="rounded px-5 py-2 mt-2 bg-red-500 text-wh
        "
          onClick={() => updateNote()}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Note;
