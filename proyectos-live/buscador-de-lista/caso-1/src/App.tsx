import type { Product } from "./types";

import { useEffect, useRef, useState } from "react";

import api from "./api";

const CONSTANTS =
{
  "PRICE_MAX_TO_LOW": "Precio mayor a menor",
  "PRICE_LOW_TO_MAX": "Precio menor a mayor",
  "NAME_A_Z": "Nombre A-Z",
  "NAME_Z_A": "Nombre Z-A",
  "NONE": "Sin filtros"
}

function convertToLocalPrice(price: number) {
  return price.toLocaleString('arg-AR', { style: "currency", currency: "ARS" })
}

function applyFilter(arr: Product[], filter: string): Product[] {
  if (filter === CONSTANTS.PRICE_MAX_TO_LOW) {
    return ([...arr].sort((a, b) => b.price - a.price))
  }

  if (filter === CONSTANTS.PRICE_LOW_TO_MAX) {
    return ([...arr].sort((a, b) => a.price - b.price))
  }

  if (filter === CONSTANTS.NAME_A_Z) {
    return ([...arr].sort((a, b) => a.title.localeCompare(b.title)))
  }

  if (filter === CONSTANTS.NAME_Z_A) {
    return ([...arr].sort((a, b) => b.title.localeCompare(a.title)))
  }

  if (filter === "NONE") {
    return (arr)
  }

  return arr
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>(() => sessionStorage.getItem("query") ?? "");
  const selectRef = useRef<HTMLSelectElement | null>(null)
  const prevFilter = sessionStorage.getItem("filter");

  useEffect(() => {
    api.search(query).then(products => {
      setProducts(products)

      const prevFilter = sessionStorage.getItem("filter");
      setFilteredProducts(
        prevFilter ? applyFilter(products, prevFilter) : products
      )

      if (query !== "") {
        sessionStorage.setItem("query", query);
      } else {
        sessionStorage.removeItem("query");
      }
    });
  }, [query]);

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { target } = e;
    const { value } = target;
    window.sessionStorage.setItem("filter", value)

    if (value === CONSTANTS.PRICE_MAX_TO_LOW) {
      setFilteredProducts([...products].sort((a, b) => b.price - a.price))
    }

    if (value === CONSTANTS.PRICE_LOW_TO_MAX) {
      setFilteredProducts([...products].sort((a, b) => a.price - b.price))
    }

    if (value === CONSTANTS.NAME_A_Z) {
      setFilteredProducts([...products].sort((a, b) => a.title.localeCompare(b.title)))
    }

    if (value === CONSTANTS.NAME_Z_A) {
      setFilteredProducts([...products].sort((a, b) => b.title.localeCompare(a.title)))
    }

    if (value === "NONE") {
      setFilteredProducts(products)
      window.sessionStorage.removeItem("filter");
    }
  }

  const clearFilters = () => {
    if (!selectRef.current) return;
    setFilteredProducts(products);
    selectRef.current.value = CONSTANTS.NONE;
  }

  return (
    <main>
      <h1>Tienda digitaloncy</h1>
      <input name="text" placeholder="tv" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div>
        <select onChange={handleFilter} ref={selectRef} defaultValue={prevFilter ?? CONSTANTS.NONE}>
          <option value={CONSTANTS.NONE}>Seleccionar</option>
          <option value={CONSTANTS.PRICE_MAX_TO_LOW}>Precio mayor a menor</option>
          <option value={CONSTANTS.PRICE_LOW_TO_MAX}>Precio menor a mayor</option>
          <option value={CONSTANTS.NAME_A_Z}>Nombre A-Z</option>
          <option value={CONSTANTS.NAME_Z_A}>Nombre Z-A</option>
        </select>
        <button onClick={clearFilters} >Borrar filtros</button>
      </div>
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <span>$ {convertToLocalPrice(product.price)}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
