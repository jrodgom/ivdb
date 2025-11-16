import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { rawgService } from "../services/rawgService";
import { gameService } from "../services/gameService";
import GameCard from "../components/GameCard";
import GameCardSkeleton from "../components/SkeletonLoaders";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const [localResults, setLocalResults] = useState([]);
  const [rawgResults, setRawgResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (query) {
      searchGames();
    }
  }, [query, page]);

  const searchGames = async () => {
    setLoading(true);
    try {
      // Buscar en BD local
      const localResult = await gameService.getGames(query, 1, 20, {});
      const localGames = localResult.data || [];
      
      // Buscar en RAWG
      const rawgData = await rawgService.searchGames(query, page, 20);
      
      // Formatear locales
      const formattedLocal = localGames.map(game => ({
        id: game.id,
        title: game.title,
        cover_image: game.cover_image,
        genre: game.genre,
        platform: game.platform,
        rating: game.average_rating || game.rating,
        metacritic: game.metacritic,
        release_date: game.release_date,
        isLocal: true,
      }));
      
      setLocalResults(formattedLocal);
      setRawgResults(rawgData.results || []);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = async (game) => {
    if (game.isLocal) {
      try {
        const searchResults = await rawgService.searchGames(game.title, 1, 1);
        if (searchResults.results && searchResults.results.length > 0) {
          const rawgGame = searchResults.results[0];
          navigate(`/game/${rawgGame.id}`);
        } else {
          navigate(`/game/${game.id}`);
        }
      } catch (error) {
        navigate(`/game/${game.id}`);
      }
    } else {
      navigate(`/game/${game.id}`);
    }
  };

  const totalResults = localResults.length + rawgResults.length;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Search className="text-indigo-400" size={32} />
            <h1 className="text-4xl font-bold text-white">
              Resultados de búsqueda
            </h1>
          </div>
          
          <p className="text-gray-400 text-lg">
            <span className="text-white font-semibold">"{query}"</span>
            {!loading && ` - ${totalResults} resultados encontrados`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(20)].map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Resultados locales */}
            {localResults.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                  <h2 className="text-2xl font-bold text-white">
                    En tu catálogo ({localResults.length})
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {localResults.map((game) => (
                    <GameCard
                      key={`local-${game.id}`}
                      game={game}
                      onClick={() => handleGameClick(game)}
                      showRating={true}
                      showFavorite={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Resultados RAWG */}
            {rawgResults.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-1 w-12 bg-fuchsia-600 rounded-full" />
                  <h2 className="text-2xl font-bold text-white">
                    Más juegos en RAWG ({rawgResults.length}+)
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {rawgResults.map((game) => (
                    <GameCard
                      key={`rawg-${game.id}`}
                      game={{
                        id: game.id,
                        title: game.name,
                        cover_image: game.background_image,
                        genre: game.genres?.map(g => g.name).join(", "),
                        platform: game.platforms?.map(p => p.platform.name).slice(0, 3).join(", "),
                        rating: game.rating,
                        metacritic: game.metacritic,
                        release_date: game.released,
                      }}
                      onClick={() => handleGameClick(game)}
                      showRating={true}
                      showFavorite={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {totalResults === 0 && (
              <div className="text-center py-20">
                <Search className="mx-auto text-gray-600 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-white mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-400 mb-6">
                  Intenta con otros términos de búsqueda
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Volver al inicio
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
