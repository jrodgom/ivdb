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
      
      // Guardar refresh token en localStorage para persistencia
      localStorage.setItem("refreshToken", data.refresh);
      
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

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No hay refresh token disponible");
      }

      const response = await fetch(`${API_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        // Si el refresh token también expiró, limpiar todo
        this.logout();
        throw new Error("Sesión expirada");
      }

      const data = await response.json();
      
      // Actualizar tokens
      localStorage.setItem("token", data.access);
      if (data.refresh) {
        // Si ROTATE_REFRESH_TOKENS está activo, se genera uno nuevo
        localStorage.setItem("refreshToken", data.refresh);
      }
      
      return data.access;
    } catch (error) {
      console.error("Refresh token error:", error);
      throw error;
    }
  },

  async getProfile() {
    try {
      // Usar fetchWithAuth para manejo automático de refresh
      const { fetchWithAuth } = await import("../utils/apiClient");
      
      const response = await fetchWithAuth(`/accounts/profile/`);
      
      if (!response.ok) {
        throw new Error("No se pudo obtener el perfil");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  async updateProfile(profileData) {
    try {
      // Importar dinámicamente para evitar dependencia circular
      const { fetchWithAuth } = await import("../utils/apiClient");
      
      const response = await fetchWithAuth(`/accounts/profile/`, {
        method: "PATCH",
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "No se pudo actualizar el perfil");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  async deleteAccount() {
    try {
      // Importar dinámicamente para evitar dependencia circular
      const { fetchWithAuth } = await import("../utils/apiClient");
      
      const response = await fetchWithAuth(`/accounts/profile/`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("No se pudo eliminar la cuenta");
      }
      
      this.logout();
      // DELETE puede no devolver contenido
      if (response.status === 204) {
        return { success: true };
      }
      return await response.json();
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },
};
