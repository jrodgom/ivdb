import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbNames = {
    "add-game": "Añadir juego",
    perfil: "Mi perfil",
    game: "Juego",
    category: "Categoría",
    login: "Iniciar sesión",
    register: "Registrarse",
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm mb-6 px-6">
      <Link
        to="/"
        className="flex items-center gap-1 text-gray-400 hover:text-indigo-400 transition-colors"
      >
        <Home size={16} />
        <span>Inicio</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = breadcrumbNames[name] || name;

        return (
          <div key={routeTo} className="flex items-center gap-2">
            <ChevronRight size={16} className="text-gray-600" />
            {isLast ? (
              <span className="text-white font-medium">{displayName}</span>
            ) : (
              <Link
                to={routeTo}
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
