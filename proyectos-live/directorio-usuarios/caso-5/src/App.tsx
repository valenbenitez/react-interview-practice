import { useEffect, useRef, useState } from "react";

import api from "./api";
import { User } from "./types";

function UsersSkeleton() {
  return (
    <ul>
      <li>
        <div style={{ height: '40px' }}>
          <strong></strong>
          <span></span>
        </div>
      </li>
      <li>
        <div style={{ height: '40px' }}>
          <strong></strong>
          <span></span>
        </div>
      </li>
      <li>
        <div style={{ height: '40px' }}>
          <strong></strong>
          <span></span>
        </div>
      </li>
      <li>
        <div style={{ height: '40px' }}>
          <strong></strong>
          <span></span>
        </div>
      </li>
    </ul>
  )
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const startPage = useRef(0);
  const maxUsers = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoading = useRef(false);

  useEffect(() => {
    handleLoadMore();
  }, []);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      if (isLoading.current) return;
      if (users.length >= maxUsers.current && maxUsers.current > 0) return;

      isLoading.current = true;
      handleLoadMore();
      isLoading.current = false;
    })

    observer.observe(element);
    return () => observer.disconnect();
  }, [users.length])

  function handleLoadMore(start = 0, count = 8) {
    api.list({ start: startPage.current, count }).then((result) => setUsers(prev => {
      maxUsers.current = result.total;
      return [...prev, ...result.items];
    }));
    startPage.current += 8;
  }

  return (
    <main>
      <h1>Directorio de usuarios</h1>
      <ul>
        {users.length ? users.map((user) => (
          <li key={user.id}>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </li>
        )) : (
          <UsersSkeleton />
        )}
      </ul>
      {users.length < maxUsers.current && <div ref={sentinelRef} />}
    </main>
  );
}

export default App;
