import { useEffect, useState } from "react";

import api from "./api";
import { User } from "./types";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [usersSelected, setUsersSelected] = useState<number[]>([])

  useEffect(() => {
    api.list().then(setUsers);
  }, []);

  function handleRemove(id: number) {
    api.remove(id);

    setUsers((users) => users.filter((user) => user.id !== id));
  }

  function handleRemoveSelection() {
    setUsersSelected(prev => {
      for (let i = 0; i < usersSelected.length; i++) {
        handleRemove(usersSelected[i])
      }
      return []
    })
  }

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;
    if (checked) {
      setUsersSelected(prev => {
        return [...prev, Number(name)]
      })
    } else {
      setUsersSelected(prev => {
        return [...prev].filter(userId => userId !== Number(name))
      })
    }
  }

  function handleElevateIndex(id: number, index: number) {
    console.log("id - index: ", { id, index })
    if (index === 0) return;

    const indexTarget = index - 1;

    setUsers(prev => {
      const newUsersList = [...users]
      const userToDown = newUsersList[indexTarget]
      const userToUp = newUsersList[index]

      newUsersList[indexTarget] = userToUp
      newUsersList[index] = userToDown

      return newUsersList
    })
  }

  return (
    <main>
      <h1>Directorio de usuarios</h1>
      <div className="toolbar">
        <span className="muted">{Object.values(usersSelected).length} seleccionados</span>
      </div>
      <ul>
        {Object.values(usersSelected).length ? <button onClick={handleRemoveSelection} >Borrar selección</button> : null}
        {users.map((user, index) => (
          <li key={user.id}>
            <input
              type="checkbox"
              name={`${user.id}`}
              checked={usersSelected.includes(user.id) ? true : false}
              onChange={handleCheckboxChange}
            />
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <button onClick={() => handleElevateIndex(user.id, index)}>↑</button>
            <button onClick={() => handleElevateIndex(user.id, index)}>↓</button>
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
