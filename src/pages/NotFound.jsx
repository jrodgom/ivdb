import { Link } from "react-router-dom";
import { Home, Search, Gamepad2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 flex items-center justify-center px-6 relative">
      {/* Glow ambiental */}
      <div className="absolute inset-0 blur-3xl bg-linear-to-tr from-indigo-600/20 via-fuchsia-600/10 to-transparent pointer-events-none" />
      
      <div className="relative text-center max-w-2xl animate-fadeIn">
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
            className="flex items-center gap-2 justify-center px-8 py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold rounded-lg shadow-[0_0_20px_#6366f1aa] hover:shadow-[0_0_25px_#a855f7aa] transition-all duration-300"
          >
            <Home size={20} />
            <span>Volver al inicio</span>
          </Link>
          
          <Link
            to="/"
            className="flex items-center gap-2 justify-center px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
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
