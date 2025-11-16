import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const gameApi = axios.create({
  baseURL: `${API_URL}/game/games/`,
});

gameApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

gameApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export const gameService = {
  async getGames(search = "", page = 1, pageSize = 10, filters = {}) {
    try {
      const params = { page };
      if (search) params.search = search;
      if (filters.genre) params.genre = filters.genre;
      if (filters.platform) params.platform = filters.platform;
      if (filters.ordering) params.ordering = filters.ordering;
      if (filters.minRating) params.min_rating = filters.minRating;
      if (filters.minMetacritic) params.min_metacritic = filters.minMetacritic;
      
      const response = await gameApi.get("/", { params });
      return { 
        data: response.data.results || [],
        total: response.data.count || 0,
        page,
        pageSize
      };
    } catch (error) {
      console.error("getGames error:", error);
      return { data: [], total: 0, page, pageSize };
    }
  },

  async getGameById(id) {
    try {
      return await gameApi.get(`${id}/`);
    } catch (error) {
      console.error("getGameById error:", error);
      throw error;
    }
  },

  async createGame(gameData) {
    try {
      return await gameApi.post("/", gameData);
    } catch (error) {
      console.error("createGame error:", error);
      throw error;
    }
  },

  async updateGame(id, gameData) {
    try {
      const response = await gameApi.patch(`${id}/`, gameData);
      return response.data;
    } catch (error) {
      console.error("updateGame error:", error);
      throw error;
    }
  },

  async deleteGame(id) {
    try {
      await gameApi.delete(`${id}/`);
      return { success: true };
    } catch (error) {
      console.error("deleteGame error:", error);
      throw error;
    }
  },
};