import GameList from "../components/GameList";

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">
        🎮 IVDB — Video Game Database
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Explora, puntúa y comenta tus videojuegos favoritos.
      </p>

      <GameList />
    </div>
  );
}
