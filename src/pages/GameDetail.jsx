import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { rawgService } from "../services/rawgService";
import { reviewService } from "../services/reviewService";
import { favoriteService } from "../services/favoriteService";
import { useAuth } from "../hooks/useAuth";
import { Star, Calendar, Users, Gamepad2, Trophy, MessageSquare, Edit2, Trash2, X, Save, Heart } from "lucide-react";
import { GameDetailSkeleton } from "../components/SkeletonLoaders";
import Tooltip from "../components/Tooltip";
import SystemRequirements from "../components/SystemRequirements";

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [gameDbId, setGameDbId] = useState(null);
  const [gameDbData, setGameDbData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  useEffect(() => {
    loadGameData();
  }, [id]);

  useEffect(() => {
    if (user && game) {
      checkIfFavorite();
    }
  }, [user, game]);

  const loadGameData = async () => {
    setIsLoading(true);
    try {
      const gameData = await rawgService.getGameDetails(id);
      setGame(gameData);

      // Buscar si el juego existe en la BD
      const response = await fetch(
        `http://localhost:8000/game/games/?search=${encodeURIComponent(gameData.name)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const existingGame = data.results?.find(
          (g) => g.title.toLowerCase() === gameData.name.toLowerCase()
        );
        
        if (existingGame) {
          setGameDbId(existingGame.id);
          setGameDbData(existingGame);
        }
      }

      if (user) {
        const existingReview = await reviewService.getUserReview(gameData.name);
        if (existingReview) {
          setUserReview(existingReview);
          setRating(existingReview.rating);
          setComment(existingReview.comment || "");
        }
      }
    } catch (error) {
      console.error("Error loading game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Debes seleccionar una puntuación");
      return;
    }

    if (!user) {
      setError("Debes iniciar sesión para puntuar");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (isEditing && userReview) {
        // Editar reseña existente
        const updatedReview = await reviewService.updateReview(userReview.id, rating, comment);
        setUserReview(updatedReview);
        setIsEditing(false);
        alert("¡Reseña actualizada con éxito!");
      } else {
        let releaseDate = null;
        if (game.released) {
          releaseDate = game.released;
        }

        const gameData = {
          title: game.name,
          description: game.description_raw || game.description || "",
          release_date: releaseDate,
          genre: game.genres?.[0]?.name || "",
          platform: game.platforms?.[0]?.platform?.name || "",
          developer: game.developers?.[0]?.name || "",
          cover_image: game.background_image || "",
          metacritic: game.metacritic || null,
          rating: game.rating || null,
          rawg_id: game.id, // Pasar el ID de RAWG para importar con requisitos
        };

        const newReview = await reviewService.createReview(gameData, rating, comment);
        setUserReview(newReview);
        alert("¡Reseña enviada con éxito!");
      }
      
      // Recargar datos del juego para actualizar la vista
      await loadGameData();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Error al enviar la reseña. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = () => {
    setIsEditing(true);
    setRating(userReview.rating);
    setComment(userReview.comment || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setRating(userReview.rating);
    setComment(userReview.comment || "");
    setError("");
  };

  const handleDeleteReview = async () => {
    try {
      await reviewService.deleteReview(userReview.id);
      setUserReview(null);
      setRating(0);
      setComment("");
      setShowDeleteModal(false);
      alert("¡Reseña eliminada con éxito!");
      await loadGameData();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error al eliminar la reseña. Inténtalo de nuevo.");
    }
  };

  const checkIfFavorite = async () => {
    try {
      // Buscar el juego en la BD para obtener su ID
      const response = await fetch(
        `http://localhost:8000/game/games/?search=${encodeURIComponent(game.name)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const existingGame = data.results?.find(
          (g) => g.title.toLowerCase() === game.name.toLowerCase()
        );
        
        if (existingGame) {
          const isFav = await favoriteService.checkFavorite(existingGame.id);
          setIsFavorite(isFav);
        }
      }
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Debes iniciar sesión para añadir favoritos");
      return;
    }

    setIsFavoriteLoading(true);
    try {
      // Buscar o crear el juego en la BD
      const response = await fetch(
        `http://localhost:8000/game/games/?search=${encodeURIComponent(game.name)}`
      );
      
      let gameId;
      if (response.ok) {
        const data = await response.json();
        const existingGame = data.results?.find(
          (g) => g.title.toLowerCase() === game.name.toLowerCase()
        );
        
        if (existingGame) {
          gameId = existingGame.id;
        }
      }

      // Si no existe, crear el juego
      if (!gameId) {
        const { fetchWithAuth } = await import("../utils/apiClient");
        const gameData = {
          title: game.name,
          description: game.description_raw || game.description || "",
          release_date: game.released || null,
          genre: game.genres?.[0]?.name || "",
          platform: game.platforms?.[0]?.platform?.name || "",
          developer: game.developers?.[0]?.name || "",
          cover_image: game.background_image || "",
          metacritic: game.metacritic || null,
          rating: game.rating || null,
        };

        const createResponse = await fetchWithAuth(`/game/games/`, {
          method: "POST",
          body: JSON.stringify(gameData),
        });

        if (createResponse.ok) {
          const newGame = await createResponse.json();
          gameId = newGame.id;
        }
      }

      if (gameId) {
        const result = await favoriteService.toggleFavorite(gameId);
        setIsFavorite(result.is_favorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Error al modificar favoritos. Inténtalo de nuevo.");
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (isLoading) {
    return <GameDetailSkeleton />;
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Juego no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 relative pt-24">
      <div className="absolute inset-0 blur-3xl bg-linear-to-tr from-indigo-600/20 via-fuchsia-600/10 to-transparent pointer-events-none" />

      <div className="relative h-[500px] overflow-hidden">
        <img
          src={game.background_image || "/placeholder-game.jpg"}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-32">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 drop-shadow-2xl flex-1">
                {game.name}
              </h1>
              <div className="flex gap-2">
                {user && (
                  <Tooltip text={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"} position="bottom">
                    <button
                      onClick={handleToggleFavorite}
                      disabled={isFavoriteLoading}
                      className={`p-4 rounded-full backdrop-blur-md transition-all duration-300 ${
                        isFavorite
                          ? "bg-red-600/80 hover:bg-red-700/80 shadow-[0_0_20px_#dc2626aa]"
                          : "bg-gray-900/60 hover:bg-gray-800/80 border border-gray-700"
                      } disabled:opacity-50`}
                    >
                      <Heart
                        size={28}
                        className={`transition-all duration-300 ${
                          isFavorite ? "fill-white text-white" : "text-gray-300"
                        }`}
                      />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              {game.released && (
                <span className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
                  <Calendar size={18} />
                  {new Date(game.released).toLocaleDateString("es-ES")}
                </span>
              )}
              {game.rating && (
                <span className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-yellow-400">{game.rating.toFixed(1)}</span> / 5
                </span>
              )}
              {game.metacritic && (
                <span className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
                  <Trophy size={18} className="text-green-400" />
                  <span className="font-bold text-green-400">{game.metacritic}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-4">
                Descripción
              </h2>
              <div
                className="game-description text-gray-300 leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{
                  __html: game.description || game.description_raw || "Sin descripción disponible",
                }}
              />
            </div>

            {/* Requisitos del Sistema */}
            {gameDbData && (gameDbData.minimum_requirements || gameDbData.recommended_requirements) && (
              <SystemRequirements
                minimum={gameDbData.minimum_requirements}
                recommended={gameDbData.recommended_requirements}
              />
            )}

            {user && (
              <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-4">
                  {userReview ? "Tu Reseña" : "Puntúa este juego"}
                </h2>
                
                {userReview && !isEditing && (
                  <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-4 mb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-green-400 font-semibold flex items-center gap-2">
                          <Star className="fill-green-400" size={20} />
                          ¡Ya has valorado este juego!
                        </p>
                        <p className="text-gray-300 text-sm mt-1">
                          Tu puntuación: <span className="font-bold text-yellow-400">{userReview.rating}/10</span>
                        </p>
                        {userReview.comment && (
                          <p className="text-gray-400 text-sm mt-2 italic">
                            "{userReview.comment}"
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditReview}
                          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 hover:scale-110"
                          title="Editar reseña"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:scale-110"
                          title="Eliminar reseña"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="bg-blue-900/30 border border-blue-600/50 rounded-xl p-4 mb-6">
                    <p className="text-blue-400 font-semibold flex items-center gap-2">
                      <Edit2 size={20} />
                      Editando tu reseña
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      Modifica tu puntuación o comentario y guarda los cambios.
                    </p>
                  </div>
                )}
                
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Puntuación (1-10) *
                    </label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-all duration-200 hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={userReview !== null && !isEditing}
                        >
                          <Star
                            size={32}
                            className={`${
                              star <= (hoverRating || rating)
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_#fbbf24]"
                                : "text-gray-700"
                            } transition-all duration-200`}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-4 text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">
                          {rating}/10
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="review-comment">
                      Reseña (opcional)
                    </label>
                    <textarea
                      id="review-comment"
                      name="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Escribe tu opinión sobre el juego..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                      disabled={userReview !== null && !isEditing}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {!userReview && (
                    <button
                      type="submit"
                      disabled={isSubmitting || rating === 0}
                      className="w-full py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold rounded-lg shadow-[0_0_20px_#6366f1aa] hover:shadow-[0_0_25px_#a855f7aa] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      <Star size={20} />
                      {isSubmitting ? "Enviando..." : "Enviar Reseña"}
                    </button>
                  )}

                  {isEditing && (
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="flex-1 py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold rounded-lg shadow-[0_0_20px_#6366f1aa] hover:shadow-[0_0_25px_#a855f7aa] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                      >
                        <Save size={20} />
                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <X size={20} />
                        Cancelar
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {!user && (
              <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-8 text-center">
                <MessageSquare size={64} className="mx-auto text-indigo-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Inicia sesión para reseñar
                </h3>
                <p className="text-gray-400 mb-6">
                  Comparte tu opinión y puntúa este juego
                </p>
                <a
                  href="/login"
                  className="inline-block px-8 py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold rounded-lg shadow-[0_0_20px_#6366f1aa] hover:shadow-[0_0_25px_#a855f7aa] transition-all duration-300"
                >
                  Iniciar Sesión
                </a>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-6">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-4">
                Información
              </h3>
              <div className="space-y-4 text-sm">
                {game.developers && game.developers.length > 0 && (
                  <div className="pb-3 border-b border-gray-800">
                    <span className="text-gray-400 font-semibold block mb-1">Desarrollador</span>
                    <p className="text-white font-medium">
                      {game.developers[0].name}
                    </p>
                  </div>
                )}
                
                {game.publishers && game.publishers.length > 0 && (
                  <div className="pb-3 border-b border-gray-800">
                    <span className="text-gray-400 font-semibold block mb-1">Distribuidor</span>
                    <p className="text-white font-medium">
                      {game.publishers[0].name}
                    </p>
                  </div>
                )}

                {game.genres && game.genres.length > 0 && (
                  <div className="pb-3 border-b border-gray-800">
                    <span className="text-gray-400 font-semibold block mb-2">Géneros</span>
                    <div className="flex flex-wrap gap-2">
                      {game.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1.5 bg-indigo-600/30 border border-indigo-500/50 rounded-lg text-indigo-300 text-xs font-semibold"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {game.platforms && game.platforms.length > 0 && (
                  <div className="pb-3 border-b border-gray-800">
                    <span className="text-gray-400 font-semibold block mb-2">Plataformas</span>
                    <div className="flex flex-wrap gap-2">
                      {game.platforms.slice(0, 6).map((p) => (
                        <span
                          key={p.platform.id}
                          className="px-3 py-1.5 bg-gray-800/80 border border-gray-700 rounded-lg text-gray-300 text-xs font-medium hover:border-indigo-500/50 transition-colors"
                        >
                          {p.platform.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {game.esrb_rating && (
                  <div className="pb-3 border-b border-gray-800">
                    <span className="text-gray-400 font-semibold block mb-1">Clasificación</span>
                    <p className="text-white font-medium">
                      {game.esrb_rating.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {game.short_screenshots && game.short_screenshots.length > 1 && (
              <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-6">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-4">
                  Capturas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {game.short_screenshots.slice(1, 5).map((screenshot) => (
                    <div
                      key={screenshot.id}
                      className="relative overflow-hidden rounded-lg border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 group cursor-pointer"
                    >
                      <img
                        src={screenshot.image}
                        alt="Screenshot"
                        className="w-full h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gray-900 border border-red-800/60 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_#dc262688]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-600/20 rounded-full">
                <Trash2 className="text-red-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white">¿Eliminar reseña?</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Esta acción es <strong className="text-red-400">permanente</strong> y no se puede deshacer. 
              Se eliminará tu puntuación y comentario de este juego.
            </p>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-1">Tu puntuación actual:</p>
              <p className="text-yellow-400 font-bold text-xl flex items-center gap-2">
                <Star className="fill-yellow-400" size={20} />
                {userReview?.rating}/10
              </p>
              {userReview?.comment && (
                <>
                  <p className="text-gray-400 text-sm mt-3 mb-1">Tu comentario:</p>
                  <p className="text-gray-300 text-sm italic">"{userReview.comment}"</p>
                </>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteReview}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_#dc262666]"
              >
                <Trash2 size={18} />
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
