// frontend/src/components/CategoryNav.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaAppleAlt, FaGlassWhiskey, FaCookieBite,
  FaCheese, FaWineBottle, FaShoppingBasket
} from 'react-icons/fa';
import './CategoryNav.css';

const iconMap = {
  'Fruta': <FaAppleAlt size={20} />,
  'Bebidas': <FaGlassWhiskey size={20} />,
  'Snacks': <FaCookieBite size={20} />,
  'Comestibles': <FaCheese size={20} />,
  'Licores': <FaWineBottle size={20} />
};

const CategoryNav = () => {
  const [categories, setCategories] = useState([]);
  const [hovered, setHovered] = useState(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories/with-subcategories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error al cargar categorías con subcategorías:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="category-nav">
      <ul>
        <li>
          <Link to="/">
            <FaShoppingBasket size={20} />
            <span>Ofertas!</span>
          </Link>
        </li>

        {categories.map((cat) => (
          <li
            key={cat.name}
            onMouseEnter={() => setHovered(cat.name)}
            onMouseLeave={() => setHovered(null)}
          >
            
            
           <Link to={`/productos?categoria=${encodeURIComponent(cat.name)}`}>
              {iconMap[cat.name] || <FaShoppingBasket size={20} />}
              <span>{cat.name}</span>
            </Link>

            {hovered === cat.name && (
              <div className="mega-menu">
                <h4>{cat.name.toUpperCase()}</h4>
                <ul>
                  {cat.subcategories.map((sub, i) => (
                    <li key={i}>
                      <Link to={`/productos?categoria=${encodeURIComponent(cat.name)}&subcategoria=${encodeURIComponent(sub)}`}>
                        {sub}
                      </Link>
                    </li>
                  ))}
                  <li className="view-all">
                    <Link to={`/productos?categoria=${cat.name}`}>Ver todos →</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNav;
