import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-linear-to-r from-gray-950 to-gray-900 text-white px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition">
          IVDB
        </Link>

        <div className="space-x-6 text-gray-300">
          <Link to="/" className="hover:text-indigo-400 transition">Inicio</Link>
          <Link to="/add-game" className="hover:text-indigo-400 transition">Añadir juego</Link>
          <Link to="/about" className="hover:text-indigo-400 transition">Acerca de</Link>
        </div>
      </div>
    </nav>
  );
}
