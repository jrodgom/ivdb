import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar perfil solo una vez al montar
    const loadProfile = async () => {
      const savedToken = localStorage.getItem("token");
      
      if (savedToken) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
          setToken(savedToken);
        } catch (error) {
          // Sesión expirada o inválida
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadProfile();
  }, []); // Solo ejecutar una vez al montar

  // Sincronizar token con localStorage cuando cambia
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      return false;
    }
  };

  const register = async (username, password, email) => {
    try {
      const data = await authService.register(username, password, email);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};