// src/components/CategoryCard/CategoryCard.jsx
import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ icon, name }) => {
  return (
    <div className="category-card">
      <span className="icon">{icon}</span>
      <span className="name">{name}</span>
    </div>
  );
};

export default CategoryCard;