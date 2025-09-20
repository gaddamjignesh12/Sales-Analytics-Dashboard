import React from 'react';
import './TopProducts.css';

const TopProducts = ({ products }) => {
  return (
    <div className="top-list">
      <h2>Top Products</h2>
      <ul>
        {products.map((p, idx) => (
          <li key={idx}>
            <span>{p.name}</span>
            <span className="badge">${p.totalSales}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProducts;
