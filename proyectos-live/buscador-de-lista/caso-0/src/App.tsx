import type { Product } from "./types";

import { useEffect, useRef, useState } from "react";

import api from "./api";

const LoadingComponent = () => {
  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input name="text" placeholder="tv" type="text" />
      <span>Cargando...</span>
      <ul>
        <li>
          <h4>TV...</h4>
          <p>Suma esta TV..</p>
          <span></span>
        </li>
      </ul>
      <ul>
        <li>
          <h4>Dron...</h4>
          <p>Nuevo Dron...</p>
          <span></span>
        </li>
      </ul>
      <ul>
        <li>
          <h4>Camara</h4>
          <p>Ultima tecnologia...</p>
          <span></span>
        </li>
      </ul>
    </main>
  )
}

function normalizeToLowerCase(text: string) {
  return text.trim().toLowerCase();
}

const PRICE_ON_SALE = 100;

function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    api.search(normalizeToLowerCase(query)).then(setProducts).finally(() => setLoading(false));
  }, [query]);

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input name="text" placeholder="tv" type="text" onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {products.map((product) => (
          <li key={product.id} className={product.price <= PRICE_ON_SALE ? "sale" : ""}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>$ {product.price}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
