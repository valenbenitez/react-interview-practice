import type { Product } from "./types";

import { useEffect, useMemo, useState } from "react";

import api from "./api";

function Recommended() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.search().then(products => {
      setProducts([...products]
        .sort(() => (Math.random() > 0.5 ? 1 : -1))
        .slice(0, 2))
    });
  }, []);

  return (
    <main>
      <h1>Productos recomendados</h1>
      <ul>
        {products
          .map((product) => (
            <li key={product.id}>
              <h4>{product.title}</h4>
              <p>{product.description}</p>
              <span>$ {product.price}</span>
            </li>
          ))}
      </ul>
    </main>
  );
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favouritesProducts, setFavouritesProducts] = useState<number[]>(() => {
    const saved = sessionStorage.getItem('favourites');
    return saved ? JSON.parse(saved) : [];
  })
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    api.search().then(setProducts);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("favourites", JSON.stringify(favouritesProducts));
  }, [favouritesProducts]);

  useEffect(() => {
    const getProducts = setTimeout(() => {
      api.search(query).then(setProducts);
    }, 300)

    return () => {
      clearTimeout(getProducts)
    }
  }, [query]);

  const handleAddFavourite = (id: number) => {
    setFavouritesProducts((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    )
  }

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input name="text" placeholder="tv" type="text" onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {products.map((product) => (
          <li
            key={product.id}
            id={product.id.toString()}
            className={favouritesProducts.includes(product.id) ? "fav" : ""}
          > 
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>{product.title}</h4>
              <button onClick={() => handleAddFavourite(product.id)}>Favorito</button>
            </div>
            <p>{product.description}</p>
            <span>$ {product.price}</span>
          </li>
        ))}
      </ul>
      <hr />
      <Recommended />
    </main>
  );
}

export default App;
