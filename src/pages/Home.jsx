import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getGames } from "../api/games";

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
        setActionGames(games.filter((g) => g.genre.toLowerCase().includes("action")));
        setAdventureGames(games.filter((g) => g.genre.toLowerCase().includes("adventure")));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  useEffect(() => {
    if (!topGames.length) return;
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % topGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [topGames]);

  // 🎠 Hero Carousel
  const HeroCarousel = () => {
    if (!topGames.length) return null;
    const phrases = [
      "Explora aventuras épicas",
      "Top juegos de la semana",
      "Sumérgete en mundos increíbles",
      "Comparte tus juegos favoritos",
      "Vive la acción",
    ];

    return (
      <div className="relative w-full h-[70vh] mb-16 overflow-hidden rounded-2xl animate-fadeIn shadow-[0_0_30px_#1f1f1f55]">
        <div
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentHero * 100}%)` }}
        >
          {topGames.map((game, index) => (
            <div
              key={game.id}
              className="shrink-0 w-full h-full relative"
              style={{
                backgroundImage: `url(${game.cover_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Gradiente superior e inferior */}
              <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-black/80"></div>

              {/* Contenido */}
              <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center z-10">
                <h2 className="text-5xl sm:text-6xl font-extrabold text-indigo-400 drop-shadow-[0_0_10px_#0008] mb-4">
                  {game.title}
                </h2>
                <p className="text-gray-200 text-lg sm:text-xl mb-6 drop-shadow-[0_0_6px_#000]">
                  {phrases[index % phrases.length]}
                </p>
                <Link
                  to="#top-juegos"
                  className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-[0_0_15px_#6366f155] hover:shadow-[0_0_20px_#6366f1aa] transition-all duration-300"
                >
                  Explorar
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Flechas */}
        <button
          onClick={() =>
            setCurrentHero((prev) => (prev - 1 + topGames.length) % topGames.length)
          }
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-3 rounded-full text-indigo-300 hover:text-white hover:bg-indigo-500/50 transition-all duration-300 z-30"
        >
          <ChevronLeft size={30} />
        </button>
        <button
          onClick={() => setCurrentHero((prev) => (prev + 1) % topGames.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-3 rounded-full text-indigo-300 hover:text-white hover:bg-indigo-500/50 transition-all duration-300 z-30"
        >
          <ChevronRight size={30} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 w-full flex justify-center gap-3 z-30">
          {topGames.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrentHero(i)}
              className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all duration-300 ${
                i === currentHero
                  ? "bg-indigo-400 scale-125 shadow-[0_0_8px_#6366f1aa]"
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  // 🎮 Carousel de secciones sin scrollbar y hover completo
  const CarouselSection = ({ title, games, category }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
      if (!rowRef.current) return;
      const cardWidth = rowRef.current.firstChild.offsetWidth + 20; // ancho + gap
      rowRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    };

    return (
      <section className="mb-16 relative group">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-200">{title}</h2>
          <Link
            to={`/categoria/${category}`}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Ver más
          </Link>
        </div>

        <div className="relative overflow-visible">
          <div
            ref={rowRef}
            className="flex gap-5 overflow-hidden pb-3 px-1"
          >
            {games.map((game) => (
              <div
                key={game.id}
                className="relative shrink-0 w-[200px] sm:w-[230px] md:w-[250px] bg-gray-900 rounded-2xl shadow-md overflow-visible transform hover:scale-105 hover:z-10 hover:shadow-[0_0_20px_#6366f155] transition-all duration-300 cursor-pointer"
              >
                {game.cover_image && (
                  <img
                    src={game.cover_image}
                    alt={game.title}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                )}
                <div className="p-3">
                  <h3 className="text-indigo-300 font-bold truncate">{game.title}</h3>
                  <p className="text-gray-400 text-sm">{game.genre}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Flechas */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-2 rounded-full text-indigo-300 hover:bg-indigo-500/50 hover:text-white transition-all duration-300 z-20"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-2 rounded-full text-indigo-300 hover:bg-indigo-500/50 hover:text-white transition-all duration-300 z-20"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 py-12 animate-fadeIn">
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
