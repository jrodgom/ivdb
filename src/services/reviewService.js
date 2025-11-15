const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const reviewService = {
  async createReview(gameData, rating, comment = "") {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Debes iniciar sesión para crear una reseña");
      }

      let gameId;

      // Primero, intentar buscar si el juego ya existe
      const searchResponse = await fetch(
        `${API_URL}/game/games/?search=${encodeURIComponent(gameData.title)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        const existingGame = searchData.results?.find(
          (g) => g.title.toLowerCase() === gameData.title.toLowerCase()
        );
        
        if (existingGame) {
          gameId = existingGame.id;
          console.log("Juego encontrado en BD:", existingGame);
        }
      }

      // Si no existe, crearlo
      if (!gameId) {
        // Limpiar la fecha para que sea compatible con Django
        const cleanGameData = {
          ...gameData,
          release_date: gameData.release_date || null,
        };

        const gameResponse = await fetch(`${API_URL}/game/games/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cleanGameData),
        });

        if (gameResponse.ok) {
          const game = await gameResponse.json();
          gameId = game.id;
          console.log("Juego creado:", game);
        } else {
          const errorData = await gameResponse.json();
          console.error("Error al crear juego:", errorData);
          throw new Error(`No se pudo crear el juego: ${JSON.stringify(errorData)}`);
        }
      }

      if (!gameId) {
        throw new Error("No se pudo obtener el ID del juego");
      }

      // Crear la reseña
      const reviewResponse = await fetch(`${API_URL}/review/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          game: gameId,
          rating,
          comment,
        }),
      });

      if (!reviewResponse.ok) {
        const error = await reviewResponse.json();
        throw new Error(JSON.stringify(error));
      }

      return await reviewResponse.json();
    } catch (error) {
      console.error("Create review error:", error);
      throw error;
    }
  },

  async getGameReviews(gameId) {
    try {
      const response = await fetch(`${API_URL}/review/reviews/?game=${gameId}`);
      
      if (!response.ok) {
        throw new Error("Error al obtener reseñas");
      }
      
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.error("Get reviews error:", error);
      return [];
    }
  },

  async getUserReview(gameTitle) {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        return null;
      }

      const response = await fetch(
        `${API_URL}/review/reviews/user_review/?game_title=${encodeURIComponent(gameTitle)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error("Get user review error:", error);
      return null;
    }
  },

  async getMyReviews() {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Debes iniciar sesión");
      }

      const response = await fetch(`${API_URL}/review/reviews/my_reviews/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Error al obtener tus reseñas");
      }

      return await response.json();
    } catch (error) {
      console.error("Get my reviews error:", error);
      return [];
    }
  },
};
