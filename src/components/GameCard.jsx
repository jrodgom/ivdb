import { useState } from "react";
import { Star, Heart, Calendar } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function GameCard({ game, onClick, showRating = true, showFavorite = true }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // Evitar que se active el onClick del card
    
    if (!user) {
      alert("Debes iniciar sesión para agregar favoritos");
      return;
    }

    setIsTogglingFavorite(true);
    try {
      const { favoriteService } = await import("../services/favoriteService");
      
      if (isFavorite) {
        await favoriteService.removeFavorite(game.id);
        setIsFavorite(false);
      } else {
        await favoriteService.addFavorite(game.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Error al actualizar favoritos");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Calcular rating promedio de reviews si existe
  const averageRating = game.average_rating || game.rating || 0;
  const reviewCount = game.review_count || 0;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1">
        {/* Imagen */}
        <div className="aspect-3/4 relative overflow-hidden">
          <img
            src={game.cover_image || "/placeholder-game.jpg"}
            alt={game.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay con info adicional */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          {showRating && averageRating > 0 && (
            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
              <Star className="fill-yellow-400 text-yellow-400" size={14} />
              <span className="text-white font-bold text-sm">{averageRating.toFixed(1)}</span>
            </div>
          )}
          
          {/* Favorite Button */}
          {showFavorite && user && (
            <button
              onClick={handleFavoriteClick}
              disabled={isTogglingFavorite}
              className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm p-2 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-50"
            >
              <Heart
                size={18}
                className={`transition-all duration-200 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-white hover:text-red-500"
                }`}
              />
            </button>
          )}
          
          {/* Año de lanzamiento */}
          {game.release_date && (
            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
              <Calendar size={12} className="text-gray-400" />
              <span className="text-white text-xs font-semibold">
                {new Date(game.release_date).getFullYear()}
              </span>
            </div>
          )}
        </div>
        
        {/* Info del juego */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm truncate group-hover:text-indigo-400 transition-colors">
            {game.title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-gray-400 text-xs truncate flex-1">{game.genre || "Sin género"}</p>
            {reviewCount > 0 && (
              <span className="text-gray-500 text-xs ml-2">
                {reviewCount} {reviewCount === 1 ? "reseña" : "reseñas"}
              </span>
            )}
          </div>
          {game.platform && (
            <p className="text-gray-500 text-xs mt-1 truncate">{game.platform}</p>
          )}
        </div>
      </div>
    </div>
  );
}
