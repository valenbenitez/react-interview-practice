import { useEffect, useRef, useState } from "react";

import api from "./api";
import { User } from "./types";

const LoadingComponent = () => {
  return (
    <main>
      <h1>Directorio de usuarios</h1>
      <input
        placeholder="Buscar por nombre o email"
        disabled={true}
      />
      <p>Cargando...</p>
    </main>
  )
};

const fetchUsers = async (query: string = "") => {
  const users = await api.search(query);
  return users;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true)
  const cache = useRef(new Map<string, User[]>())

  useEffect(() => {
    const key = query.trim().toLowerCase();

    const getProducts = setTimeout(async () => {
      if (cache.current.has(key)) {
        const users = cache.current.get(key)!;
        setUsers(users);
      } else {
        const users = await fetchUsers(query);
        cache.current.set(key, users)
        setUsers(users);
      }
      setLoading(false)
    }, 300)

    return (() => clearTimeout(getProducts))
  }, [query]);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true)
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    await api.add({ name, email });

    const usersUpdated = await fetchUsers(query);

    setUsers(usersUpdated);
    setLoading(false);
    form.reset();
  }

  async function handleRemove(id: number) {
    setLoading(true);
    await api.remove(id);
    const usersUpdated = await fetchUsers(query);
    setUsers(usersUpdated)
    setLoading(false);
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <main>
      <h1>Directorio de usuarios</h1>
      <input
        placeholder="Buscar por nombre o email"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre" />
        <input name="email" placeholder="Email" />
        <button>Agregar</button>
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
