import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // obtener perfil
      (async () => {
        try {
          const userData = await authService.getProfile(token);
          setUser(userData);
        } catch {
          setUser(null);
          setToken(null);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      localStorage.removeItem("token");
      setLoading(false);
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

  const register = async (username, password) => {
    try {
      const data = await authService.register(username, password);
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