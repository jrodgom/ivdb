import { useState, useEffect } from "react";
import { Filter, X, ChevronDown } from "lucide-react";

export default function GameFilters({ onFilterChange, onSearch, initialFilters = {} }) {
  const [showFilters, setShowFilters] = useState(true); // Ahora siempre visible por defecto
  const [filters, setFilters] = useState({
    genre: initialFilters.genre || "",
    platform: initialFilters.platform || "",
    ordering: initialFilters.ordering || "-created_at",
    minRating: initialFilters.minRating || "",
    minMetacritic: initialFilters.minMetacritic || "",
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const genres = [
    "Action",
    "Adventure",
    "RPG",
    "Strategy",
    "Shooter",
    "Puzzle",
    "Simulation",
    "Sports",
    "Racing",
    "Fighting",
    "Horror",
    "Platformer",
  ];

  const platforms = [
    "PC",
    "PlayStation",
    "PlayStation 4",
    "PlayStation 5",
    "Xbox",
    "Xbox One",
    "Xbox Series X/S",
    "Nintendo Switch",
    "iOS",
    "Android",
  ];

  const orderingOptions = [
    { value: "-created_at", label: "Más recientes" },
    { value: "created_at", label: "Más antiguos" },
    { value: "title", label: "A-Z" },
    { value: "-title", label: "Z-A" },
    { value: "release_date", label: "Fecha (antigua)" },
    { value: "-release_date", label: "Fecha (reciente)" },
    { value: "-metacritic", label: "Metacritic (mayor)" },
    { value: "metacritic", label: "Metacritic (menor)" },
  ];

  useEffect(() => {
    // Evitar llamadas en el primer render
    if (isInitialized) {
      onFilterChange(filters);
    } else {
      setIsInitialized(true);
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      genre: "",
      platform: "",
      ordering: "-created_at",
      minRating: "",
      minMetacritic: "",
    });
  };

  const hasActiveFilters = filters.genre || filters.platform || filters.ordering !== "-created_at" || filters.minRating || filters.minMetacritic;

  return (
    <div className="mb-8">
      <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-indigo-400" />
          <h3 className="text-white font-semibold">Filtrar juegos</h3>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
              {[filters.genre, filters.platform, filters.minRating, filters.minMetacritic].filter(Boolean).length}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="filter-genre">
                Género
              </label>
              <select
                id="filter-genre"
                name="genre"
                value={filters.genre}
                onChange={(e) => handleFilterChange("genre", e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <option value="">Todos los géneros</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="filter-platform">
                Plataforma
              </label>
              <select
                id="filter-platform"
                name="platform"
                value={filters.platform}
                onChange={(e) => handleFilterChange("platform", e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <option value="">Todas las plataformas</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="filter-ordering">
                Ordenar por
              </label>
              <select
                id="filter-ordering"
                name="ordering"
                value={filters.ordering}
                onChange={(e) => handleFilterChange("ordering", e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {orderingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="filter-min-rating">
                Valoración mínima
              </label>
              <select
                id="filter-min-rating"
                name="minRating"
                value={filters.minRating}
                onChange={(e) => handleFilterChange("minRating", e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <option value="">Cualquier valoración</option>
                <option value="4">⭐ 4+ estrellas</option>
                <option value="3">⭐ 3+ estrellas</option>
                <option value="2">⭐ 2+ estrellas</option>
                <option value="1">⭐ 1+ estrellas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="filter-min-metacritic">
                Metacritic mínimo
              </label>
              <select
                id="filter-min-metacritic"
                name="minMetacritic"
                value={filters.minMetacritic}
                onChange={(e) => handleFilterChange("minMetacritic", e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <option value="">Cualquier puntuación</option>
                <option value="90">90+ (Universal acclaim)</option>
                <option value="75">75+ (Generally favorable)</option>
                <option value="50">50+ (Mixed reviews)</option>
              </select>
            </div>
          </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-400">Filtros activos:</span>
            {filters.genre && (
              <span className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 rounded-full text-indigo-300 text-sm flex items-center gap-2">
                Género: {filters.genre}
                <button
                  onClick={() => handleFilterChange("genre", "")}
                  className="hover:text-white transition"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.platform && (
              <span className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 rounded-full text-indigo-300 text-sm flex items-center gap-2">
                Plataforma: {filters.platform}
                <button
                  onClick={() => handleFilterChange("platform", "")}
                  className="hover:text-white transition"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.minRating && (
              <span className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 rounded-full text-indigo-300 text-sm flex items-center gap-2">
                Rating: {filters.minRating}+ ⭐
                <button
                  onClick={() => handleFilterChange("minRating", "")}
                  className="hover:text-white transition"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.minMetacritic && (
              <span className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 rounded-full text-indigo-300 text-sm flex items-center gap-2">
                Metacritic: {filters.minMetacritic}+
                <button
                  onClick={() => handleFilterChange("minMetacritic", "")}
                  className="hover:text-white transition"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="ml-auto px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-all duration-200"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
