import React, { useState } from 'react';

const emptyForm = { name: '', category: 'Camping', description: '', specification: '', rating: '', price: '', quantity: '', image: '' };

export default function ProductForm({ onAdd, categories }) {
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    onAdd({ ...form, id: Date.now(), price: Number(form.price), quantity: Number(form.quantity), rating: Number(form.rating) });
    setForm(emptyForm);
    setOpen(false);
  };
  return <section className="panel form-panel">
    <div className="section-heading"><div><h2>Add a Product</h2><p>Enter all product information below.</p></div><button className="secondary-button" onClick={() => setOpen(!open)}>{open ? 'Close form' : 'Add product +'}</button></div>
    {open && <form className="product-form" onSubmit={submit}>
      <label>Product name<input name="name" value={form.name} onChange={update} required /></label>
      <label>Category<select name="category" value={form.category} onChange={update} required>{categories.filter(c => c !== 'All Products').map(c => <option key={c}>{c}</option>)}</select></label>
      <label>Image URL<input name="image" type="url" value={form.image} onChange={update} placeholder="https://example.com/image.jpg" required /></label>
      <label>Rating (0–5)<input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={update} required /></label>
      <label>Price (₱)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={update} required /></label>
      <label>Quantity<input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={update} required /></label>
      <label className="wide-field">Description<textarea name="description" value={form.description} onChange={update} required rows="2" /></label>
      <label className="wide-field">Specification<textarea name="specification" value={form.specification} onChange={update} required rows="2" /></label>
      <div className="wide-field"><button className="primary-button" type="submit">Save product</button></div>
    </form>}
  </section>;
}
