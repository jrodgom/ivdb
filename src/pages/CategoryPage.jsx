import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gameService } from "../services/gameService";
import { rawgService } from "../services/rawgService";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import GameCardSkeleton from "../components/SkeletonLoaders";

export default function CategoryPage() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCategoryGames();
  }, [categoria, page]);

  const loadCategoryGames = async () => {
    setLoading(true);
    try {
      let genreSlug = "";
      let ordering = "-rating";
      
      if (categoria === "accion") {
        genreSlug = "action";
      } else if (categoria === "aventura") {
        genreSlug = "adventure";
      } else if (categoria === "top") {
        ordering = "-metacritic";
      }

      const params = {
        page: page,
        page_size: 20,
        ordering: ordering,
      };

      if (genreSlug) {
        params.genres = genreSlug;
      }

      if (categoria === "top") {
        params.metacritic = "80,100";
      }

      const response = await rawgService.getGames(params);
      
      const gamesWithRawgFormat = response.results.map(game => ({
        id: game.id,
        title: game.name,
        cover_image: game.background_image,
        genre: game.genres?.map(g => g.name).join(", ") || "",
        platform: game.platforms?.map(p => p.platform.name).slice(0, 3).join(", ") || "",
        rating: game.rating,
        metacritic: game.metacritic,
        release_date: game.released,
      }));

      setGames(gamesWithRawgFormat);
      setTotalPages(Math.ceil(response.count / 20));
    } catch (error) {
      console.error("Error cargando juegos:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (game) => {
    navigate(`/game/${game.id}`);
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 relative">
      {/* Glow ambiental */}
      <div className="absolute inset-0 blur-3xl bg-linear-to-tr from-indigo-600/20 via-fuchsia-600/10 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-3">
            {categoria === "top"
              ? "Top Juegos"
              : categoria === "accion"
              ? "Juegos de Acción"
              : "Juegos de Aventura"}
          </h1>
          <p className="text-gray-400">Explora {games.length} juegos increíbles</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
            {[...Array(20)].map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No hay juegos en esta categoría.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {games.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleGameClick(game)}
                  className="cursor-pointer group"
                >
                  <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1">
                    <div className="aspect-3/4 relative overflow-hidden">
                      {game.cover_image ? (
                        <img
                          src={game.cover_image}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-500">Sin imagen</span>
                        </div>
                      )}
                      
                      {game.rating && (
                        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                          <Star className="fill-yellow-400 text-yellow-400" size={14} />
                          <span className="text-white font-bold text-sm">{game.rating.toFixed(1)}</span>
                        </div>
                      )}
                      
                      {game.metacritic && (
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg flex items-center gap-1 font-bold text-xs ${
                          game.metacritic >= 75 ? 'bg-green-600' : 
                          game.metacritic >= 50 ? 'bg-yellow-600' : 
                          'bg-red-600'
                        }`}>
                          <span className="text-white">{game.metacritic}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {game.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 truncate">{game.genre || "Sin género"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación mejorada */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {/* Botón anterior */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-white hover:border-indigo-500 hover:bg-gray-800 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-800 disabled:hover:bg-gray-900/50"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Números de página */}
                {getPageNumbers().map((pageNum, idx) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                      ···
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`min-w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                        page === pageNum
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110"
                          : "bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-white hover:border-indigo-500 hover:bg-gray-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                ))}

                {/* Botón siguiente */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-white hover:border-indigo-500 hover:bg-gray-800 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-800 disabled:hover:bg-gray-900/50"
                  aria-label="Página siguiente"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
