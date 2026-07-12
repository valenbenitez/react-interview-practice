import { useEffect, useRef, useState } from "react";

import api from "./api";
import { User } from "./types";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<User[][]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    api.list().then(setUsers);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        handleUndo();
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    const formData = new FormData(formRef.current!);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const idUserOptimistic = users.length + 1;
    const userOptimistc = { id: idUserOptimistic, name, email };

    saveRecordsOfUsers(users);
    setUsers((users) => users.concat(userOptimistc));
    formRef.current?.reset();

    const user = await api.add({ name, email });

    const usersUpdated = [...users].filter(user => user.id !== idUserOptimistic).concat(user)
    setUsers(usersUpdated)
  }

  async function handleRemove(id: number) {
    saveRecordsOfUsers(users);
    await api.remove(id);

    setUsers((users) => users.filter((user) => user.id !== id));
  }

  async function saveRecordsOfUsers(prevUsers: User[]) {
    setHistory((prev) => [...prev, prevUsers].slice(-3));
  }

  function handleUndo() {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;

      const lastSnapshot = prevHistory[prevHistory.length - 1];
      setUsers(lastSnapshot);

      return prevHistory.slice(0, -1); // saca el snapshot usado
    });
  }

  return (
    <main>
      <h1>Directorio de usuarios</h1>
      <form ref={formRef}>
        <input name="name" placeholder="Nombre" />
        <input name="email" placeholder="Email" />
        <button onClick={handleSubmit}>Agregar</button>
      </form>
      <ul>
        {users && users.map((user) => (
          <li key={user.id}>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <button className="remove" onClick={() => handleRemove(user.id)}>
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
