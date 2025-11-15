import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { gameService } from "../services/gameService";

export default function CategoryPage() {
  const { categoria } = useParams();
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

  const totalPages = Math.ceil(games.length / pageSize);

  const paginatedGames = games.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
      <h1 className="text-4xl font-bold text-indigo-400 mb-6 text-center">
        {categoria === "top"
          ? "Top Juegos"
          : categoria === "accion"
          ? "Juegos de Acción"
          : "Juegos de Aventura"}
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Cargando juegos...</p>
      ) : paginatedGames.length === 0 ? (
        <p className="text-center text-gray-500">No hay juegos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedGames.map((game) => (
            <div
              key={game.id}
              className="bg-gray-900 rounded-xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              {game.cover_image && (
                <img
                  src={game.cover_image}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-3">
                <h3 className="text-indigo-300 font-bold">{game.title}</h3>
                <p className="text-gray-400 text-sm">{game.genre}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            ◀ Anterior
          </button>
          <span className="text-gray-300">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Siguiente ▶
          </button>
        </div>
      )}
    </div>
  );
}
