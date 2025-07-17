

// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';              // usa tu wrapper de axios


export const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!token) {
        logout();
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');   
        setUser(res.data.usuario);
        localStorage.setItem('user', JSON.stringify(res.data.usuario));
      } catch (err) {
        console.error('Error al verificar token', err);
        savedUser ? setUser(JSON.parse(savedUser)) : setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}



export default AuthContext;
