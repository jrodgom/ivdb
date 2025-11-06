import { useState, useEffect } from "react";
import { getGames } from "../api/games";

export default function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGames = async () => {
    try {
      const response = await getGames(); // ✅ ejecutamos la función
      setGames(response.data);
    } catch (error) {
      console.error("Error cargando juegos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  if (loading) return <p className="text-center">Cargando juegos...</p>;

  if (!games || games.length === 0)
    return <p className="text-center text-gray-500">No hay juegos disponibles.</p>;

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold mb-4">Juegos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white shadow rounded p-4 flex flex-col items-center"
          >
            {game.cover_image && (
              <img
                src={game.cover_image}
                alt={game.title}
                className="w-40 h-40 object-cover mb-2 rounded"
              />
            )}
            <p className="font-semibold">{game.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
