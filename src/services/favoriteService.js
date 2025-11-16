import { fetchWithAuth } from "../utils/apiClient";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const favoriteService = {
  async toggleFavorite(gameId) {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Debes iniciar sesión para añadir favoritos");
      }

      const response = await fetchWithAuth(`/favorite/favorites/toggle/`, {
        method: "POST",
        body: JSON.stringify({ game_id: gameId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al modificar favoritos");
      }

      return await response.json();
    } catch (error) {
      console.error("Toggle favorite error:", error);
      throw error;
    }
  },

  async checkFavorite(gameId) {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        return false;
      }

      const response = await fetchWithAuth(
        `/favorite/favorites/check/?game_id=${gameId}`
      );

      if (response.ok) {
        const data = await response.json();
        return data.is_favorite;
      }
      
      return false;
    } catch (error) {
      console.error("Check favorite error:", error);
      return false;
    }
  },

  async getMyFavorites() {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Debes iniciar sesión");
      }

      const response = await fetchWithAuth(`/favorite/favorites/`);

      if (!response.ok) {
        throw new Error("Error al obtener tus favoritos");
      }

      return await response.json();
    } catch (error) {
      console.error("Get favorites error:", error);
      return [];
    }
  },
};
