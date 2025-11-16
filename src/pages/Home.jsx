import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gameService } from "../services/gameService";
import { rawgService } from "../services/rawgService";
import SearchBar from "../components/SearchBar";
import GameFilters from "../components/GameFilters";
import GameCard from "../components/GameCard";
import GameCardSkeleton from "../components/SkeletonLoaders";

export default function Home() {
  const navigate = useNavigate();
  const [topGames, setTopGames] = useState([]);
  const [actionGames, setActionGames] = useState([]);
  const [adventureGames, setAdventureGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filters, setFilters] = useState({});
  const [filteredGames, setFilteredGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const gamesPerPage = 10;

  useEffect(() => {
    loadInitialGames();
  }, []);

  useEffect(() => {
    const hasFilters = filters.genre || filters.platform || (filters.ordering && filters.ordering !== "-created_at");
    
    if (hasFilters) {
      setIsFiltering(true);
      setCurrentPage(1);
      loadFilteredGames(1);
    } else {
      setIsFiltering(false);
      setFilteredGames([]);
    }
  }, [filters]);

  const loadInitialGames = async () => {
    setLoading(true);
    try {
      const result = await gameService.getGames("", 1, 100, {});
      let games = result.data || [];

      // Eliminar duplicados
      const uniqueGames = [];
      const seenTitles = new Set();
      
      for (const game of games) {
        const normalizedTitle = game.title.toLowerCase().trim();
        if (!seenTitles.has(normalizedTitle)) {
          seenTitles.add(normalizedTitle);
          uniqueGames.push(game);
        }
      }

      setAllGames(uniqueGames);
      
      // Ordenar por rating
      const sortedByRating = [...uniqueGames].sort((a, b) => {
        return (b.average_rating || b.rating || 0) - (a.average_rating || a.rating || 0);
      });
      setTopGames(sortedByRating.slice(0, 10));
      
      const actionFiltered = uniqueGames.filter((g) => g.genre && g.genre.toLowerCase().includes("action"));
      const adventureFiltered = uniqueGames.filter((g) => g.genre && g.genre.toLowerCase().includes("adventure"));
      
      setActionGames(actionFiltered.slice(0, 10));
      setAdventureGames(adventureFiltered.slice(0, 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredGames = async (page) => {
    setLoadingFiltered(true);
    try {
      const result = await gameService.getGames("", page, gamesPerPage, filters);
      let games = result.data || [];

      // Eliminar duplicados
      const uniqueGames = [];
      const seenTitles = new Set();
      
      for (const game of games) {
        const normalizedTitle = game.title.toLowerCase().trim();
        if (!seenTitles.has(normalizedTitle)) {
          seenTitles.add(normalizedTitle);
          uniqueGames.push(game);
        }
      }

      setFilteredGames(uniqueGames);
      setTotalPages(Math.ceil((result.total || uniqueGames.length) / gamesPerPage));
    } catch (error) {
      console.error("Error loading filtered games:", error);
      setFilteredGames([]);
    } finally {
      setLoadingFiltered(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadFilteredGames(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="pt-20">
        <div className="relative w-full h-[500px] overflow-hidden">
          <div className="relative h-full">
            {topGames.map((game, index) => (
              <div
                key={game.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={game.cover_image}
                  alt={game.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/80" />
                
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
            ))})
          </div>

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

        <div className="max-w-7xl mx-auto px-6 pb-20">
          <GameFilters onFilterChange={setFilters} />

          {isFiltering && (
            <section className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                  Resultados
                  {filters.genre && ` - ${filters.genre}`}
                  {filters.platform && ` - ${filters.platform}`}
                </h2>
                <span className="text-gray-400">
                  {filteredGames.length} juegos
                </span>
              </div>

              {loadingFiltered ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {[...Array(10)].map((_, i) => (
                    <GameCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredGames.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
                    {filteredGames.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        onClick={() => handleGameClick(game)}
                        showRating={true}
                        showFavorite={true}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-800 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNum = index + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                  currentPage === pageNum
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                          ) {
                            return <span key={pageNum} className="text-gray-500 px-2">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-800 hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No se encontraron juegos con estos filtros</p>
                </div>
              )}
            </section>
          )}

          {!isFiltering && (
            <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Top Juegos</h2>
              <Link to="/categoria/top" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Ver más →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {loading ? (
                [...Array(10)].map((_, i) => <GameCardSkeleton key={i} />)
              ) : (
                topGames.slice(0, 10).map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={() => handleGameClick(game)}
                    showRating={true}
                    showFavorite={true}
                  />
                ))
              )}
            </div>
          </section>
          )}

          {!isFiltering && (loading || actionGames.length > 0) && (
            <section className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Juegos de Acción</h2>
                <Link to="/categoria/accion" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Ver más →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {loading ? (
                  [...Array(10)].map((_, i) => <GameCardSkeleton key={i} />)
                ) : (
                  actionGames.slice(0, 10).map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onClick={() => handleGameClick(game)}
                      showRating={true}
                      showFavorite={true}
                    />
                  ))
                )}
              </div>
            </section>
          )}

          {!isFiltering && (loading || adventureGames.length > 0) && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Juegos de Aventura</h2>
                <Link to="/categoria/aventura" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Ver más →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {loading ? (
                  [...Array(10)].map((_, i) => <GameCardSkeleton key={i} />)
                ) : (
                  adventureGames.slice(0, 10).map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onClick={() => handleGameClick(game)}
                      showRating={true}
                      showFavorite={true}
                    />
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
