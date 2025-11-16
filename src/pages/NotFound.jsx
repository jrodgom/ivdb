import { Link } from "react-router-dom";
import { Home, Search, Gamepad2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-indigo-950 to-purple-900 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="mb-8 flex justify-center">
          <Gamepad2 className="text-indigo-400/20" size={120} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-4">
          404
        </h1>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          ¡Página no encontrada!
        </h2>
        
        <p className="text-gray-400 text-lg mb-8">
          Parece que has intentado acceder a un nivel que no existe. ¿Quizás te perdiste en el camino?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/20"
          >
            <Home size={20} />
            <span>Volver al inicio</span>
          </Link>
          
          <Link
            to="/"
            className="flex items-center gap-2 justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 hover:scale-105 border border-gray-700"
          >
            <Search size={20} />
            <span>Buscar juegos</span>
          </Link>
        </div>
        
        <div className="mt-12 text-gray-500 text-sm">
          <p>Si crees que esto es un error, por favor contacta con soporte.</p>
        </div>
      </div>
    </div>
  );
}
