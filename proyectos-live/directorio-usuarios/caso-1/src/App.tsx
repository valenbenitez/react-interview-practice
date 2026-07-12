import {useEffect, useState} from "react";

import api from "./api";
import {User} from "./types";

function sortUsers(order, users) {
  if (order === "a-z") {
      const usersSorted = users.sort((a, b) => a.name.localeCompare(b.name))
      return usersSorted
    } else if (order === "z-a") {
      const usersSorted = users.sort((a, b) => b.name.localeCompare(a.name))
      return usersSorted
    }
    return users;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.list().then(users => {
      const filter = sessionStorage.getItem("filter");
      const usersFiltered = filter ? sortUsers(filter, users) : users
      setUsers(usersFiltered)
    });
  }, []);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    setUsers((users) =>
      users.concat({id: Date.now(), name, email}),
    );
    form.reset();
  }

  function handleSort(order: string) {
    const usersToFilter = [...users];
    const usersSorted = sortUsers(order, usersToFilter)
    sessionStorage.setItem("filter", order)
    setUsers(usersSorted)
  }

  return (
    <main>
      <h1>Directorio de usuarios</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>Ordenar:</span>
        <button onClick={() => handleSort('a-z')} >A-Z</button>
        <button onClick={() => handleSort('z-a')} >Z-A</button>
      </div>
      <form id={"form"} onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre" required={true} />
        <input name="email" placeholder="Email" required={true} type={"email"} />
        <button>Agregar</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
