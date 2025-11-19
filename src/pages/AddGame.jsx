import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Gamepad2, Search, Calendar, Tag, Monitor, Users, Download, CheckCircle, Star } from "lucide-react";
import { fetchWithAuth } from "../utils/apiClient";
import { rawgService } from "../services/rawgService";

export default function AddGame() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState("");
  const [importedGames, setImportedGames] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError("Escribe el nombre de un juego para buscar");
      return;
    }

    setIsSearching(true);
    setError("");
    setSearchResults([]);

    try {
      const results = await rawgService.searchGames(searchQuery);
      setSearchResults(results.results || []);
      
      if (results.results.length === 0) {
        setError("No se encontraron juegos con ese nombre");
      }
    } catch (err) {
      console.error("Error searching games:", err);
      setError("Error al buscar juegos. Inténtalo de nuevo.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleImportGame = async (game) => {
    setIsImporting(true);
    setError("");

    try {
      // Llamar al endpoint para importar el juego completo desde RAWG
      const response = await fetchWithAuth(`/game/import-from-rawg/`, {
        method: "POST",
        body: JSON.stringify({ rawg_id: game.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al importar el juego");
      }

      const importedGame = await response.json();
      setImportedGames([...importedGames, game.id]);
      
      // Mostrar mensaje de éxito breve y redirigir
      setTimeout(() => {
        navigate(`/game/${game.id}`);
      }, 1000);
    } catch (err) {
      console.error("Error importing game:", err);
      setError(err.message || "Error al importar el juego. Puede que ya exista en la base de datos.");
    } finally {
      setIsImporting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 pt-20 flex items-center justify-center">
        <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl p-8 max-w-md text-center">
          <Gamepad2 size={64} className="mx-auto text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso restringido</h2>
          <p className="text-gray-400 mb-6">Debes iniciar sesión para añadir juegos</p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold rounded-lg shadow-[0_0_20px_#6366f1aa] transition-all duration-300"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 bg-size-[200%_200%] animate-gradient-x relative overflow-hidden">
      <div className="absolute inset-0 blur-3xl bg-linear-to-tr from-indigo-600/20 via-fuchsia-600/10 to-transparent pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-600/20 rounded-full mb-4">
            <Gamepad2 size={48} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-3">
            Importar Juego desde RAWG
          </h1>
          <p className="text-gray-400 text-lg">
            Busca y añade juegos a la base de datos con toda su información
          </p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="search-game">
                <Search size={18} />
                Buscar juego
              </label>
              <div className="flex gap-3">
                <input
                  id="search-game"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: The Witcher 3, GTA V, Elden Ring..."
                  className="flex-1 px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-6 py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Buscar
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3 animate-fadeIn">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Resultados de búsqueda ({searchResults.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((game) => {
                const isImported = importedGames.includes(game.id);
                
                return (
                  <div
                    key={game.id}
                    className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {game.background_image ? (
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Gamepad2 size={48} className="text-gray-600" />
                        </div>
                      )}
                      {game.metacritic && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white font-bold px-2 py-1 rounded">
                          {game.metacritic}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                        {game.name}
                      </h3>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        {game.released && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar size={14} />
                            {new Date(game.released).toLocaleDateString("es-ES")}
                          </div>
                        )}
                        {game.rating && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            {game.rating.toFixed(1)} / 5
                          </div>
                        )}
                        {game.genres && game.genres.length > 0 && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Tag size={14} />
                            <span className="line-clamp-1">
                              {game.genres.slice(0, 2).map(g => g.name).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {isImported ? (
                        <div className="flex items-center justify-center gap-2 py-2 bg-green-900/30 border border-green-600/50 rounded-lg text-green-400">
                          <CheckCircle size={18} />
                          Importado
                        </div>
                      ) : (
                        <button
                          onClick={() => handleImportGame(game)}
                          disabled={isImporting}
                          className="w-full py-2 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isImporting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                              Importando...
                            </>
                          ) : (
                            <>
                              <Download size={18} />
                              Importar
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 bg-indigo-900/20 border border-indigo-800/40 rounded-xl p-6">
          <h3 className="text-indigo-300 font-semibold mb-2">💡 ¿Cómo funciona?</h3>
          <ul className="text-indigo-200 text-sm space-y-2 list-disc list-inside">
            <li>Busca cualquier juego en la base de datos de RAWG</li>
            <li>Importa el juego con toda su información: descripción, imágenes, géneros, etc.</li>
            <li>Se añadirán automáticamente los requisitos del sistema (si están disponibles)</li>
            <li>Los usuarios podrán valorar y comentar sobre el juego</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
