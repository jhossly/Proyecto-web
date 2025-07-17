// frontend/src/context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        const cleaned = parsed.map(item => ({
          ...item,
          precio: typeof item.precio === 'string' 
            ? parseFloat(item.precio.replace('$', '').trim()) 
            : Number(item.precio),
          quantity: Number(item.quantity) || 1
        }));
        setCartItems(cleaned);
      } catch (e) {
        console.error('Error parsing cart:', e);
        localStorage.removeItem('cart');
      }
    }
  }, []);
   
      useEffect(() => {
  const savedCart = localStorage.getItem('pendingCart');
  if (savedCart) {
    try {
      const parsed = JSON.parse(savedCart);
      setCartItems(parsed);
      localStorage.removeItem('pendingCart');
    } catch (e) {
      console.error('Error al restaurar carrito pendiente');
    }
  }
}, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, {
        ...product,
        quantity: 1,
        precio: typeof product.precio === 'string' 
          ? parseFloat(product.precio.replace('$', '').trim()) 
          : Number(product.precio)
      }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Number(newQuantity)) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // Función para obtener el conteo total de items
  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        getItemCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook 
export const useCart = () => useContext(CartContext);

