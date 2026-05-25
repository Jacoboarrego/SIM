// Contexto de autenticación que mantiene usuario y token en toda la app.
import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicializa el usuario y token desde localStorage si ya existen.
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sim_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sim_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sim_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sim_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('sim_token', token);
    } else {
      localStorage.removeItem('sim_token');
    }
  }, [token]);

  // Llama al servicio de login y almacena usuario y token en el contexto.
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      setUser(response.user);
      setToken(response.token);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const fallback = error?.message || 'Error de inicio de sesión.';
      return { success: false, message: error?.response?.data?.message || fallback };
    }
  };

  // Llama al servicio de registro y guarda usuario y token si es exitoso.
  const register = async (data) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      setUser(response.user);
      setToken(response.token);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const fallback = error?.message || 'Error de registro.';
      return { success: false, message: error?.response?.data?.message || fallback };
    }
  };

  // Cierra sesión eliminando los datos de autenticación.
  const logout = () => {
    setUser(null);
    setToken('');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
