import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gameService } from "../services/gameService";
import { rawgService } from "../services/rawgService";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryPage() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  useEffect(() => {
    const loadCategoryGames = async () => {
      setLoading(true);
      try {
        const result = await gameService.getGames();
        let filtered = result.data;

        if (categoria === "accion") {
          filtered = filtered.filter((g) =>
            g.genre && g.genre.toLowerCase().includes("action")
          );
        } else if (categoria === "aventura") {
          filtered = filtered.filter((g) =>
            g.genre && g.genre.toLowerCase().includes("adventure")
          );
        } else if (categoria === "top") {
          filtered = filtered.slice(0, 100);
        }

        setGames(filtered);
      } catch (error) {
        console.error(error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryGames();
  }, [categoria]);

  const handleGameClick = async (localGame) => {
    try {
      const searchResults = await rawgService.searchGames(localGame.title, 1, 1);
      
      if (searchResults.results && searchResults.results.length > 0) {
        const rawgGame = searchResults.results[0];
        navigate(`/game/${rawgGame.id}`);
      } else {
        alert(`No se encontró "${localGame.title}" en la base de datos global. Intenta buscarlo manualmente.`);
      }
    } catch (error) {
      console.error("Error buscando juego:", error);
      alert("Error al buscar el juego");
    }
  };

  const totalPages = Math.ceil(games.length / pageSize);
  const paginatedGames = games.slice((page - 1) * pageSize, page * pageSize);

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
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando juegos...</p>
          </div>
        ) : paginatedGames.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No hay juegos en esta categoría.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {paginatedGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleGameClick(game)}
                  className="cursor-pointer group"
                >
                  <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1">
                    <div className="aspect-3/4 relative overflow-hidden">
                      {game.cover_image && (
                        <img
                          src={game.cover_image}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {game.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 truncate">{game.genre}</p>
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
