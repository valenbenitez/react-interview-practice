import { useEffect, useState } from "react";

import api from "./api";
import { User } from "./types";

const LoadingComponent = () => {
  return (
    <main>
      <h1>Directorio de usuarios</h1>
      <span>Cargando...</span>
    </main>
  )
}

function normalizeText(text: string) {
  return text.trim().toLowerCase();
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState("");
  const matches = users.filter((user) => normalizeText(user.name).includes(normalizeText(query)));

  useEffect(() => {
    api.list().then(users => {
      setUsers(users)
      setLoading(false)
    });
  }, []);

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <main>
      <h1>Directorio de usuarios</h1>
      <input
        placeholder="Buscar por nombre"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p>Usuarios totales: {users.length} - {matches.length} resultados de {users.length} usuarios</p>
      <ul>
        {matches.length > 0 ? matches.map((user) => (
          <li key={user.id}>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </li>
        )) : (
          <span>Sin resultados</span>
        )}
      </ul>
    </main>
  );
}

export default App;
