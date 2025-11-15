import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { rawgService } from "../services/rawgService";
import { reviewService } from "../services/reviewService";
import { useAuth } from "../hooks/useAuth";
import { Star, Calendar, Users, Gamepad2, Trophy, MessageSquare } from "lucide-react";

export default function GameDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGameData();
  }, [id]);

  const loadGameData = async () => {
    setIsLoading(true);
    try {
      const gameData = await rawgService.getGameDetails(id);
      setGame(gameData);

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
      // Validar y formatear la fecha
      let releaseDate = null;
      if (game.released) {
        // La API de RAWG devuelve fechas en formato YYYY-MM-DD que Django acepta
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
      };

      const newReview = await reviewService.createReview(gameData, rating, comment);
      
      setUserReview(newReview);
      alert("¡Reseña enviada con éxito!");
      
      // Recargar datos del juego para actualizar la vista
      await loadGameData();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Error al enviar la reseña. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Cargando juego...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Juego no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={game.background_image || "/placeholder-game.jpg"}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-4">{game.name}</h1>
            <div className="flex items-center gap-4 text-gray-300">
              {game.released && (
                <span className="flex items-center gap-2">
                  <Calendar size={18} />
                  {new Date(game.released).toLocaleDateString("es-ES")}
                </span>
              )}
              {game.rating && (
                <span className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400" />
                  {game.rating.toFixed(1)} / 5
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Acerca de</h2>
              <div
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: game.description || game.description_raw || "Sin descripción disponible",
                }}
              />
            </div>

            {/* Rating Section */}
            {user && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {userReview ? "Tu Reseña" : "Puntúa este juego"}
                </h2>
                
                {userReview && (
                  <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4 mb-4">
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
                )}
                
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Puntuación (1-10) *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110"
                          disabled={userReview !== null}
                        >
                          <Star
                            size={28}
                            className={`${
                              star <= (hoverRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-600"
                            } transition-colors`}
                          />
                        </button>
                      ))}
                      <span className="ml-4 text-2xl font-bold text-white">
                        {rating > 0 && `${rating}/10`}
                      </span>
                    </div>
                  </div>

                  {/* Comment (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reseña (opcional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Escribe tu opinión sobre el juego..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                      disabled={userReview !== null}
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  {!userReview && (
                    <button
                      type="submit"
                      disabled={isSubmitting || rating === 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Reseña"}
                    </button>
                  )}
                </form>
              </div>
            )}

            {!user && (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 mb-4">
                  Inicia sesión para puntuar y reseñar este juego
                </p>
                <a
                  href="/login"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                  Iniciar Sesión
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Información</h3>
              <div className="space-y-3 text-sm">
                {game.developers && game.developers.length > 0 && (
                  <div>
                    <span className="text-gray-400">Desarrollador:</span>
                    <p className="text-white font-medium">
                      {game.developers[0].name}
                    </p>
                  </div>
                )}
                
                {game.publishers && game.publishers.length > 0 && (
                  <div>
                    <span className="text-gray-400">Distribuidor:</span>
                    <p className="text-white font-medium">
                      {game.publishers[0].name}
                    </p>
                  </div>
                )}

                {game.genres && game.genres.length > 0 && (
                  <div>
                    <span className="text-gray-400">Géneros:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {game.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-gray-700 rounded-full text-white text-xs"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {game.platforms && game.platforms.length > 0 && (
                  <div>
                    <span className="text-gray-400">Plataformas:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {game.platforms.slice(0, 5).map((p) => (
                        <span
                          key={p.platform.id}
                          className="px-3 py-1 bg-gray-700 rounded-full text-white text-xs"
                        >
                          {p.platform.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {game.metacritic && (
                  <div>
                    <span className="text-gray-400">Metacritic:</span>
                    <p className="text-white font-bold text-lg">
                      {game.metacritic}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Screenshots */}
            {game.short_screenshots && game.short_screenshots.length > 1 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Capturas</h3>
                <div className="grid grid-cols-2 gap-2">
                  {game.short_screenshots.slice(1, 5).map((screenshot) => (
                    <img
                      key={screenshot.id}
                      src={screenshot.image}
                      alt="Screenshot"
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
