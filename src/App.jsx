import React, { useMemo, useState } from "react";
import { initialProducts, categories } from "./data.js";
import CategoryFilter from "./components/CategoryFilter.jsx";
import ProductForm from "./components/ProductForm.jsx";
import ProductDetails from "./components/ProductDetails.jsx";

const money = (value) =>
  `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState({});

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (activeCategory === "All Products" ||
            product.category === activeCategory) &&
          product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, activeCategory, search],
  );

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => cart[product.id] > 0)
        .map((product) => ({
          ...product,
          cartQuantity: cart[product.id],
          subtotal: product.price * cart[product.id],
        })),
    [products, cart],
  );
  const overallTotal = cartItems.reduce(
    (total, item) => total + item.subtotal,
    0,
  );
  const totalUnits = products.reduce(
    (total, product) => total + product.quantity,
    0,
  );
  const lowStockCount = products.filter(
    (product) => product.quantity < 5,
  ).length;

  const addProduct = (product) =>
    setProducts((current) => [...current, product]);
  const addToCart = (product) => {
    if (product.quantity < 1) return;
    setCart((current) => ({
      ...current,
      [product.id]: Math.min((current[product.id] || 0) + 1, product.quantity),
    }));
    setSelectedProduct(null);
  };
  const changeCartQuantity = (product, change) =>
    setCart((current) => {
      const nextQuantity = Math.min(
        product.quantity,
        (current[product.id] || 0) + change,
      );
      return { ...current, [product.id]: Math.max(0, nextQuantity) };
    });

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">INVENTORY SYSTEM</p>
          <h1>Outdoor Gear Management</h1>
          <p className="subtitle">
            Manage products, stock, and cart totals in one place.
          </p>
        </div>
        <div className="topbar-badge">React Product Management</div>
      </header>
      <section className="stats-grid">
        <div className="stat-card">
          <span>Total products</span>
          <strong>{products.length}</strong>
        </div>
        <div className="stat-card">
          <span>Total units in stock</span>
          <strong>{totalUnits}</strong>
        </div>
        <div className="stat-card">
          <span>Low-stock products</span>
          <strong className={lowStockCount ? "warning-text" : ""}>
            {lowStockCount}
          </strong>
        </div>
        <div className="stat-card">
          <span>Cart total</span>
          <strong>{money(overallTotal)}</strong>
        </div>
      </section>

      <ProductForm onAdd={addProduct} categories={categories} />

      <section className="panel inventory-panel">
        <div className="section-heading">
          <div>
            <h2>Product Inventory</h2>
            <p>Choose a category or search for a product.</p>
          </div>
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />
        </div>
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Subtotal at stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <img src={product.image} alt={product.name} />
                      <div>
                        <strong>{product.name}</strong>
                        <small>Rating: {product.rating} / 5</small>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{money(product.price)}</td>
                  <td>
                    <span
                      className={
                        product.quantity < 5 ? "stock-pill low" : "stock-pill"
                      }
                    >
                      {product.quantity}{" "}
                      {product.quantity === 1 ? "unit" : "units"}
                      {product.quantity < 5 ? " · Low" : ""}
                    </span>
                  </td>
                  <td>{money(product.price * product.quantity)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="text-button"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Details
                      </button>
                      <button
                        className="small-primary"
                        disabled={product.quantity < 1}
                        onClick={() => addToCart(product)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel cart-panel">
        <div className="section-heading">
          <div>
            <h2>Shopping Cart</h2>
            <p>Adjust the quantity of each selected product.</p>
          </div>
          <strong className="cart-total">Total: {money(overallTotal)}</strong>
        </div>
        {cartItems.length === 0 ? (
          <p className="empty-cart">
            Your cart is empty. Add a product from the inventory above.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Unit price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{money(item.price)}</td>
                    <td>
                      <div className="quantity-control">
                        <button
                          onClick={() => changeCartQuantity(item, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          −
                        </button>
                        <span>{item.cartQuantity}</span>
                        <button
                          disabled={item.cartQuantity >= item.quantity}
                          onClick={() => changeCartQuantity(item, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                        <button
                          className="remove-button"
                          onClick={() =>
                            setCart((current) => ({ ...current, [item.id]: 0 }))
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                    <td>{money(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">Overall total</td>
                  <td>{money(overallTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
      <footer>By: Justin Alto</footer>
      <ProductDetails
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
    </main>
  );
}
