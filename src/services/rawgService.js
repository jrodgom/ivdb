const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const RAWG_API_URL = "https://api.rawg.io/api";

export const rawgService = {
  async searchGames(query, page = 1, pageSize = 20) {
    try {
      if (!RAWG_API_KEY || RAWG_API_KEY === "YOUR_API_KEY_HERE") {
        console.warn("⚠️ RAWG API key no configurada. Configura VITE_RAWG_API_KEY en tu archivo .env");
        return { results: [], count: 0, error: "API key no configurada" };
      }

      const response = await fetch(
        `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("RAWG API error:", response.status, errorData);
        throw new Error("Error al buscar juegos en RAWG");
      }
      
      const data = await response.json();
      return {
        results: data.results || [],
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
      };
    } catch (error) {
      console.error("Search games error:", error);
      return { results: [], count: 0, error: error.message };
    }
  },

  async getGameDetails(gameId) {
    try {
      const response = await fetch(
        `${RAWG_API_URL}/games/${gameId}?key=${RAWG_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error("Error al obtener detalles del juego");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Get game details error:", error);
      throw error;
    }
  },

  async getTrendingGames(pageSize = 20) {
    try {
      const response = await fetch(
        `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&ordering=-rating&page_size=${pageSize}`
      );
      
      if (!response.ok) {
        throw new Error("Error al obtener juegos destacados");
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Get trending games error:", error);
      return [];
    }
  },

  async getGames(params = {}) {
    try {
      if (!RAWG_API_KEY || RAWG_API_KEY === "YOUR_API_KEY_HERE") {
        console.warn("⚠️ RAWG API key no configurada");
        return { results: [], count: 0, error: "API key no configurada" };
      }

      const queryParams = new URLSearchParams({
        key: RAWG_API_KEY,
        ...params,
      });

      const response = await fetch(`${RAWG_API_URL}/games?${queryParams}`);
      
      if (!response.ok) {
        throw new Error("Error al obtener juegos");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Get games error:", error);
      return { results: [], count: 0, error: error.message };
    }
  },
};
