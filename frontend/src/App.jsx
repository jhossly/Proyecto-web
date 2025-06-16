
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Footer from './components/Footer';
import Register from './pages/Register';
import Ventas from './pages/Ventas';
import AdminPanel from './pages/AdminPanel';
import AdminInicio from './pages/AdminInicio';
import Inventario from './pages/Inventario';
import Categoria from './pages/Categorias';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartSidebar from './components/CartSidebar';
import HomeWithReviews from './pages/HomeWithReviews';
import Checkout from './pages/Checkout';
import ListaUsuarios from './pages/ListaUsuarios';
import Estadisticas from './pages/Estadisticas';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

const AppContent = () => {
  return (
    <>
      <main className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categorias/:nombreCategoria" element={<Categoria />} />
          
          
          {/* Rutas protegidas para admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/adminPanel" element={<AdminPanel />} />
            <Route path="/adminInicio" element={<AdminInicio />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/Usuarios" element={<ListaUsuarios />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
          </Route>
          
          {/* Rutas protegidas para user */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/con-resenas" element={<HomeWithReviews/>} />
            <Route path="/checkout" element={<Checkout />} />

          </Route>
        </Routes>
      </main>

      <Footer />
      <CartSidebar />
    </>
  );
};

export default App;