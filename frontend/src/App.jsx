import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from "./pages/Login";
import Footer from './components/Footer';
import Register from './pages/Register';
import Ventas from './pages/Ventas';
import ProductCard from './components/ProductCard';
import AdminPanel from './pages/AdminPanel';
import AdminInicio from './pages/AdminInicio';
import Inventario from './pages/Inventario';
import { CartProvider ,CartContext } from './context/CartContext';
import CartSidebar from './components/CartSidebar';

import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <BrowserRouter>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </BrowserRouter>
    </div>
  );
};

const AppContent = () => {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeItem } = useContext(CartContext);

  return (
    <>
      {/* Header  */}
      
      <main className="main-content">
        
         
        <Routes>
           <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
          <Route path="/ventas" element={<Ventas />} />
          <Route path='/adminPanel' element={<AdminPanel/>}/>
          <Route path="/adminInicio" element={<AdminInicio />} />
          <Route path='/inventario' element={<Inventario/>}/>
          
          </Route>
          
          <Route element ={<ProtectedRoute/>}>   
          <Route path="/productCard" element={<ProductCard/>}/>
       
          </Route>
        </Routes>
        

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />
      </main>
      
      <Footer />
    </>
  );
};

export default App;