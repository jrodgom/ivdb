import { useState, useEffect, useRef } from "react";
import { getGames } from "../api/games";
import { Link } from "react-router-dom";

export default function Home() {
  const [topGames, setTopGames] = useState([]);
  const [actionGames, setActionGames] = useState([]);
  const [adventureGames, setAdventureGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGamesByCategory = async () => {
    setLoading(true);
    try {
      const all = await getGames();
      const games = all.data;

      setTopGames(games.slice(0, 20));
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

  useEffect(() => {
    loadGamesByCategory();
  }, []);

  const CarouselSection = ({ title, games, category }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
      if (rowRef.current) {
        const scrollAmount = rowRef.current.offsetWidth * 0.8; 
        rowRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
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
            className="flex gap-4 overflow-hidden scroll-smooth"
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
            className="hidden group-hover:block absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 z-10"
          >
            ◀
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 z-10"
          >
            ▶
          </button>
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      

      {!loading && (
        <>
          <CarouselSection title="Top Juegos" games={topGames} category="top" />
          <CarouselSection title="Juegos de Acción" games={actionGames} category="accion" />
          <CarouselSection title="Juegos de Aventura" games={adventureGames} category="aventura" />
        </>
      )}
    </div>
  );
}
