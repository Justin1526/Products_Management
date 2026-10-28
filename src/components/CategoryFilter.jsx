import React from 'react';

export default function CategoryFilter({ categories, activeCategory, onChange }) {
  return <div className="category-row" aria-label="Product categories">
    {categories.map(category => <button key={category} className={activeCategory === category ? 'category active' : 'category'} onClick={() => onChange(category)}>{category}</button>)}
  </div>;
}
