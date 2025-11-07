import GameList from "../components/GameList";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-5xl font-extrabold mb-4 text-center text-indigo-400">
        🎮 IVDB — Video Game Database
      </h1>
      <p className="text-gray-400 text-center mb-8">
        Explora, puntúa y comenta tus videojuegos favoritos.
      </p>

      <GameList />
    </div>
  );
}