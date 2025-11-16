import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gameService } from "../services/gameService";
import { rawgService } from "../services/rawgService";
import SearchBar from "../components/SearchBar";
import GameFilters from "../components/GameFilters";

export default function Home() {
  const navigate = useNavigate();
  const [topGames, setTopGames] = useState([]);
  const [actionGames, setActionGames] = useState([]);
  const [adventureGames, setAdventureGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadGames();
  }, [filters]);

  const loadGames = async () => {
    setLoading(true);
    try {
      const result = await gameService.getGames("", 1, 100, filters);
      const games = result.data || [];

      setAllGames(games);
      setTopGames(games.slice(0, 10));
      setActionGames(games.filter((g) => g.genre && g.genre.toLowerCase().includes("action")));
      setAdventureGames(games.filter((g) => g.genre && g.genre.toLowerCase().includes("adventure")));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!topGames.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [topGames]);

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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % topGames.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + topGames.length) % topGames.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900">
      {/* Contenedor principal con padding-top para el navbar */}
      <div className="pt-20">
        {/* Hero Carousel - Altura controlada */}
        <div className="relative w-full h-[500px] overflow-hidden">
          {/* Slides */}
          <div className="relative h-full">
            {topGames.map((game, index) => (
              <div
                key={game.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Imagen de fondo */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${game.cover_image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                
                {/* Overlay oscuro */}
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/80" />
                
                {/* Contenido centrado */}
                <div className="relative h-full flex flex-col justify-center items-center text-center px-6 z-10">
                  <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 drop-shadow-2xl">
                    {game.title}
                  </h2>
                  <p className="text-gray-300 text-lg mb-6 max-w-2xl drop-shadow-lg">
                    {game.genre || "Descubre este increíble juego"}
                  </p>
                  <button
                    onClick={() => handleGameClick(game)}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Controles del carrusel */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-indigo-600 p-3 rounded-full text-white transition-all duration-300 z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-indigo-600 p-3 rounded-full text-white transition-all duration-300 z-20"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicadores (dots) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {topGames.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-8 bg-indigo-500"
                    : "w-2 bg-gray-400 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <SearchBar />
          <p className="text-center text-gray-400 text-sm mt-3">
            Busca entre más de 800,000 juegos de todas las plataformas
          </p>
        </div>

        {/* Secciones de géneros */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          {/* Filtros */}
          <GameFilters onFilterChange={setFilters} />

          {/* Todos los Juegos Filtrados */}
          {(filters.genre || filters.platform || filters.ordering !== "-created_at") && allGames.length > 0 && (
            <section className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                  Juegos 
                  {filters.genre && ` - ${filters.genre}`}
                  {filters.platform && ` - ${filters.platform}`}
                </h2>
                <span className="text-gray-400">{allGames.length} resultados</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {allGames.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleGameClick(game)}
                    className="cursor-pointer"
                  >
                    <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1">
                      <div className="aspect-3/4 relative overflow-hidden">
                        <img
                          src={game.cover_image || "/placeholder-game.jpg"}
                          alt={game.title}
                          className="w-full h-full object-cover"
                        />
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
            </section>
          )}

          {/* Top Juegos */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Top Juegos</h2>
              <Link to="/categoria/top" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Ver más →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {topGames.slice(0, 10).map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleGameClick(game)}
                  className="cursor-pointer"
                >
                  <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1">
                    <div className="aspect-3/4 relative overflow-hidden">
                      <img
                        src={game.cover_image}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
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
          </section>

          {/* Juegos de Acción */}
          {actionGames.length > 0 && (
            <section className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Juegos de Acción</h2>
                <Link to="/categoria/accion" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Ver más →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {actionGames.slice(0, 10).map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleGameClick(game)}
                    className="cursor-pointer"
                  >
                    <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1">
                      <div className="aspect-3/4 relative overflow-hidden">
                        <img
                          src={game.cover_image}
                          alt={game.title}
                          className="w-full h-full object-cover"
                        />
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
            </section>
          )}

          {/* Juegos de Aventura */}
          {adventureGames.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Juegos de Aventura</h2>
                <Link to="/categoria/aventura" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Ver más →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {adventureGames.slice(0, 10).map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleGameClick(game)}
                    className="cursor-pointer"
                  >
                    <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1">
                      <div className="aspect-3/4 relative overflow-hidden">
                        <img
                          src={game.cover_image}
                          alt={game.title}
                          className="w-full h-full object-cover"
                        />
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
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
