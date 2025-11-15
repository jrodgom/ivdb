const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const authService = {
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Usuario o contraseña incorrectos");
      }
      
      const data = await response.json();
      console.log("Login exitoso:", data);
      
      // JWT devuelve { access, refresh }
      return { 
        token: data.access, 
        refresh: data.refresh, 
        user: { username } 
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async register(username, password, email) {
    try {
      // Primero crea el usuario usando el endpoint de accounts
      const response = await fetch(`${API_URL}/accounts/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error("Error en registro:", error);
        throw new Error(JSON.stringify(error));
      }
      
      const data = await response.json();
      console.log("Registro exitoso:", data);
      
      // Después de registrar, hacer login automático
      return await this.login(username, password);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  async getProfile(token) {
    try {
      const response = await fetch(`${API_URL}/accounts/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        // Si es 401, el token expiró (es normal)
        if (response.status === 401) {
          throw new Error("Token expirado");
        }
        throw new Error("No se pudo obtener el perfil");
      }
      
      return await response.json();
    } catch (error) {
      // Solo loguear si no es un token expirado (401)
      if (!error.message.includes("Token expirado")) {
        console.error("Get profile error:", error);
      }
      throw error;
    }
  },

  async deleteAccount(token) {
    try {
      const response = await fetch(`${API_URL}/accounts/profile/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error("No se pudo eliminar la cuenta");
      }
      
      this.logout();
      return await response.json();
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
  },
};
