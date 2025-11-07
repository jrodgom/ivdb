import { useState, useEffect } from "react";
import { getGames } from "../api/games";

export default function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadGames = async (query = "") => {
    try {
      const response = await getGames(query);
      setGames(response.data);
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
    loadGames(value);
  };

  return (
    <div className="mt-10">
      {/* 🧠 Barra de búsqueda */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="🔍 Buscar juegos..."
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500"
        />
      </div>

      {/* 🔄 Estado de carga */}
      {loading ? (
        <p className="text-center text-gray-400">Cargando juegos...</p>
      ) : games.length === 0 ? (
        <p className="text-center text-gray-500">No hay juegos que coincidan</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-gray-900 text-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              {game.cover_image && (
                <img
                  src={game.cover_image}
                  alt={game.title}
                  className="w-full h-60 object-cover"
                />
              )}
              <div className="p-3">
                <h2 className="font-bold text-lg text-indigo-300">{game.title}</h2>
                <p className="text-sm text-gray-400">{game.genre}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
