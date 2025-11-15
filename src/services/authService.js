const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const authService = {
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al iniciar sesión");
      }
      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async register(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al registrar usuario");
      }
      return await response.json();
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  async getProfile(token) {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Sesión inválida");
      return await response.json();
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
  },
};
