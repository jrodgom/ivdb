import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import { rawgService } from "../services/rawgService";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const debounceTimer = useRef(null);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      setErrorMessage("");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await rawgService.searchGames(searchQuery, 1, 10);
      
      if (data.error) {
        setErrorMessage("⚠️ Necesitas configurar tu API key de RAWG. Lee BUSQUEDA_Y_REVIEWS.md");
        setResults([]);
      } else {
        setResults(data.results);
      }
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage("Error al buscar juegos. Intenta de nuevo.");
      setResults([]);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleGameClick = (gameId) => {
    setQuery("");
    setShowResults(false);
    navigate(`/game/${gameId}`);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          id="game-search"
          name="search"
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && results.length > 0 && setShowResults(true)}
          placeholder="Buscar entre más de 800,000 juegos..."
          autoComplete="off"
          className="w-full pl-12 pr-12 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-[500px] overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">
              Buscando...
            </div>
          ) : errorMessage ? (
            <div className="p-8 text-center">
              <p className="text-yellow-400 mb-2">{errorMessage}</p>
              <a 
                href="https://rawg.io/apidocs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Obtener API key gratis aquí
              </a>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {results.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handleGameClick(game.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-700 transition text-left"
                >
                  {game.background_image ? (
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
                      <Search size={24} className="text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{game.name}</h3>
                    <p className="text-sm text-gray-400">
                      {game.released ? new Date(game.released).getFullYear() : "N/A"}
                      {game.platforms && ` • ${game.platforms.length} plataformas`}
                    </p>
                  </div>
                  {game.rating && (
                    <div className="text-yellow-400 font-bold">
                      ⭐ {game.rating.toFixed(1)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No se encontraron resultados para "{query}"
            </div>
          )}
        </div>
      )}

      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
