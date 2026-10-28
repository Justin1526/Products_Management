import React from 'react';

export default function ProductDetails({ product, onClose, onAddToCart }) {
  if (!product) return null;
  return <div className="modal-backdrop" role="presentation" onClick={onClose}>
    <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={e => e.stopPropagation()}>
      <button className="close-button" onClick={onClose} aria-label="Close details">×</button>
      <img className="detail-image" src={product.image} alt={product.name} />
      <div className="detail-content"><p className="eyebrow">{product.category}</p><h2 id="detail-title">{product.name}</h2><p>{product.description}</p><p><strong>Specification:</strong> {product.specification}</p><p><strong>Rating:</strong> {product.rating} / 5</p><p><strong>Price:</strong> ₱{product.price.toFixed(2)}</p><p><strong>Stock:</strong> {product.quantity} units</p><button className="primary-button" disabled={product.quantity < 1} onClick={() => onAddToCart(product)}>Add to cart</button></div>
    </section>
  </div>;
}
