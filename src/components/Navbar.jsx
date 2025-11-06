import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-2xl">
        IVDB
      </Link>

      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-300">
          Inicio
        </Link>
        <Link to="/add-game" className="hover:text-gray-300">
          Añadir juego
        </Link>
        <Link to="/about" className="hover:text-gray-300">
          Acerca de
        </Link>
      </div>
    </nav>
  );
}
