import { Link } from "react-router-dom";
import { Gamepad2, Heart, Star, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950/80 border-t border-gray-800 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="text-indigo-400" size={32} />
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500">
                IVDB
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Tu plataforma definitiva para descubrir, valorar y compartir tus juegos favoritos.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/add-game" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Añadir juego
                </Link>
              </li>
              <li>
                <Link to="/perfil" className="text-gray-400 hover:text-indigo-400 transition-colors text-sm">
                  Mi perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm cursor-pointer hover:text-indigo-400 transition-colors">
                  Acción
                </span>
              </li>
              <li>
                <span className="text-gray-400 text-sm cursor-pointer hover:text-indigo-400 transition-colors">
                  Aventura
                </span>
              </li>
              <li>
                <span className="text-gray-400 text-sm cursor-pointer hover:text-indigo-400 transition-colors">
                  RPG
                </span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-white font-semibold mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-indigo-600 rounded-lg transition-all duration-300 hover:scale-110"
                title="GitHub"
              >
                <Github className="text-gray-300" size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-all duration-300 hover:scale-110"
                title="Twitter"
              >
                <Twitter className="text-gray-300" size={20} />
              </a>
              <a
                href="mailto:contacto@ivdb.com"
                className="p-2 bg-gray-800 hover:bg-fuchsia-600 rounded-lg transition-all duration-300 hover:scale-110"
                title="Email"
              >
                <Mail className="text-gray-300" size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} IVDB. Hecho con <Heart className="inline text-red-500 fill-red-500" size={14} /> para gamers.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">Powered by RAWG API</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
