import { useEffect, useState, DragEvent } from "react";
import { INote } from "../App";
import { User } from "../types";
import { v4 as uuidv4 } from "uuid";

const Note = ({ body, id, isNew = false }: INote) => {
  const [note, setNote] = useState(body);
  const [changed, setChanged] = useState(false);
  const [timer, setTimer] = useState(0);

  const [firstUsers, setFirsUsers] = useState<User[]>();
  const [usingMention, setUsingMention] = useState(false);
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    if (changed) {
      const newTimer = window.setTimeout(() => {
        updateNote();
      }, 5000);

      setTimer(newTimer);
      return () => {
        console.log("removin timeout");
        return clearTimeout(newTimer);
      };
    }
  }, [note, changed]);

  const getUsers = async () => {
    const res = await fetch("https://challenge.surfe.com/users", {
      method: "GET",
    });
    const data: User[] = await res.json();
    const sortedData = data.sort((a, b) =>
      a.first_name.localeCompare(b.first_name)
    );
    setUsers(sortedData);
    setFirsUsers(sortedData.slice(0, 5));
  };

  const updateNote = () => {
    console.log(">>", note);
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
      console.log(">> SAVING NOTE");
      isNew ? saveNewNote() : saveNote();
    } catch (e) {
      console.error(e);
    }
  };

  const hangleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    setChanged(true);
    clearTimeout(timer);

    if (e.target.value.slice(-1) === "@") {
      console.log(">> Mentioned @");
      setUsingMention(true);
      getUsers();
    }
  };

  const handleOnDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    const email = e.dataTransfer.getData("mention");
    console.log(">> Mention", email);
    console.log(">> Drop");
    setNote(note + " " + email);
    setChanged(true);
  };

  return (
    <div
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
      className="p-2 rounded-sm w-60 h-60 shadow-lg shadow-gray-600 hover:shadow-2xl hover:shadow-gray-900 bg-slate-100 text-gray-800 flex flex-col"
    >
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
        onChange={hangleInputChange}
        className="mt-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg  outline-none "
        placeholder="Type your curent thoughts..."
      ></textarea>
      {usingMention ? (
        <div>
          <ul>
            {firstUsers?.map((user) => {
              return <li key={uuidv4()}>{user.email}</li>;
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default Note;
