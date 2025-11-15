import { useState, useEffect, useRef } from "react";
import { gameService } from "../services/gameService";

export default function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debounceTimer = useRef(null);

  const loadGames = async (query = "") => {
    setLoading(true);
    try {
      const result = await gameService.getGames(query);
      setGames(result.data);
    } catch (error) {
      console.error("Error cargando juegos:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    // Limpiar debounce anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Nuevo debounce: esperar 300ms sin cambios antes de llamar API
    debounceTimer.current = setTimeout(() => {
      loadGames(value);
    }, 300);
  };

  // Componente Skeleton para carga
  const SkeletonCard = () => (
    <div className="bg-gray-800 text-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-60 bg-gray-700" />
      <div className="p-3">
        <div className="h-4 bg-gray-700 rounded mb-2" />
        <div className="h-3 bg-gray-700 rounded w-3/4" />
      </div>
    </div>
  );

  return (
    <div className="mt-10">
      {/* 🧠 Barra de búsqueda */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="🔍 Buscar juegos..."
          aria-label="Buscar juegos por título o género"
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500"
        />
      </div>

      {/* 🔄 Estado de carga */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : games.length === 0 ? (
        <p className="text-center text-gray-500" role="status">No hay juegos que coincidan</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6" role="grid">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-gray-900 text-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
              role="gridcell"
              aria-label={`${game.title}, ${game.genre || "Sin género"}`}
            >
              {game.cover_image ? (
                <img
                  src={game.cover_image}
                  alt={game.title}
                  className="w-full h-60 object-cover"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect fill='%23374151' width='300' height='400'/%3E%3Ctext x='50%' y='50%' fill='%239ca3af' text-anchor='middle' dy='.3em' font-size='16'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="w-full h-60 bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Sin portada</span>
                </div>
              )}
              <div className="p-3">
                <h2 className="font-bold text-lg text-indigo-300 truncate">{game.title}</h2>
                <p className="text-sm text-gray-400 truncate">{game.genre || "Sin género"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
