import { useState, useEffect, useRef } from "react";
import { getGames } from "../api/games";
import { Link } from "react-router-dom";

export default function Home() {
  const [topGames, setTopGames] = useState([]);
  const [actionGames, setActionGames] = useState([]);
  const [adventureGames, setAdventureGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        const all = await getGames();
        const games = all.data;

        setTopGames(games.slice(0, 10));
        setActionGames(
          games.filter((g) => g.genre.toLowerCase().includes("action"))
        );
        setAdventureGames(
          games.filter((g) => g.genre.toLowerCase().includes("adventure"))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  useEffect(() => {
    if (topGames.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % topGames.length);
    }, 5000); // cada 5s cambia de juego
    return () => clearInterval(interval);
  }, [topGames]);

  const HeroCarousel = () => {
    if (topGames.length === 0) return null;
    const game = topGames[currentHero];
    const phrases = [
      "Explora aventuras épicas",
      "Top juegos de la semana",
      "Sumérgete en mundos increíbles",
      "Comparte tus juegos favoritos",
      "Vive la acción",
    ];

    return (
      <div className="relative w-full h-[70vh] mb-12 rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            backgroundImage: `url(${game.cover_image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
          }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center px-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-indigo-400 mb-4">
              {game.title}
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              {phrases[currentHero % phrases.length]}
            </p>
            <Link
              to="#top-juegos"
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition"
            >
              Explorar
            </Link>
          </div>
        </div>

        {/* Flechas de navegación */}
        <button
          onClick={() =>
            setCurrentHero(
              (prev) => (prev - 1 + topGames.length) % topGames.length
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 z-10"
        >
          ◀
        </button>
        <button
          onClick={() => setCurrentHero((prev) => (prev + 1) % topGames.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 z-10"
        >
          ▶
        </button>

        {/* Dots indicadores */}
        <div className="absolute bottom-4 w-full flex justify-center gap-2">
          {topGames.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentHero ? "bg-indigo-400" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const CarouselSection = ({ title, games, category }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
      if (rowRef.current) {
        const scrollAmount = rowRef.current.offsetWidth / 2; // desplaza 4 juegos aprox
        rowRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <section className="mb-12 relative group">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-200">{title}</h2>
          <Link
            to={`/categoria/${category}`}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Ver más
          </Link>
        </div>
        <div className="relative">
          <div
            ref={rowRef}
            className="flex gap-4 overflow-x-hidden scroll-smooth"
          >
            {games.map((game) => (
              <div
                key={game.id}
                className="min-w-[200px] sm:min-w-[220px] md:min-w-[240px] lg:min-w-[250px] bg-gray-900 rounded-xl shadow-md overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
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
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 z-10"
          >
            ◀
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 z-10"
          >
            ▶
          </button>
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {!loading && <HeroCarousel />}
      {!loading && (
        <>
          <div id="top-juegos">
            <CarouselSection title="Top Juegos" games={topGames} category="top" />
          </div>
          <CarouselSection title="Juegos de Acción" games={actionGames} category="accion" />
          <CarouselSection title="Juegos de Aventura" games={adventureGames} category="aventura" />
        </>
      )}
    </div>
  );
}
