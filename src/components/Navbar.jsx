import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, Plus, Search, Flame, Star } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [categoriesMenu, setCategoriesMenu] = useState(false);

  const categories = [
    { name: "Acción", slug: "accion" },
    { name: "Aventura", slug: "aventura" },
    { name: "RPG", slug: "rpg" },
    { name: "Shooter", slug: "shooter" },
    { name: "Deportes", slug: "deportes" },
    { name: "Estrategia", slug: "estrategia" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-black/40 border-b border-gray-800 shadow-[0_0_25px_#6366f155] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center relative">
          <Link
            to="/"
            className="relative text-3xl font-extrabold tracking-tight transition-all duration-300 group"
          >
            <span className="relative z-10 bg-linear-to-r from-indigo-400 via-fuchsia-500 to-indigo-400 bg-size[:200%_auto] animate-gradient-x text-transparent bg-clip-text drop-shadow-[0_0_10px_#7c3aedaa]">
              IVDB
            </span>
            <span className="absolute inset-0 blur-lg opacity-60 bg-linear-to-r from-indigo-500 via-fuchsia-500 to-indigo-400 rounded-md scale-105 group-hover:opacity-80 transition-all duration-500"></span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 flex-1 max-w-3xl mx-8">
            <div className="flex items-center gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-gray-300 font-medium hover:text-indigo-400 transition relative ${isActive ? "text-indigo-400" : ""} ${isActive ? "after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-indigo-400" : ""}`
                }
              >
                Inicio
              </NavLink>
              
              <div className="relative">
                <button
                  onClick={() => setCategoriesMenu(!categoriesMenu)}
                  className="text-gray-300 font-medium hover:text-indigo-400 transition flex items-center gap-1"
                >
                  Explorar
                  <ChevronDown size={16} className={`transition-transform ${categoriesMenu ? "rotate-180" : ""}`} />
                </button>
                {categoriesMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          navigate(`/categoria/${cat.slug}`);
                          setCategoriesMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-400 transition"
                      >
                        {cat.name}
                      </button>
                    ))}
                    <div className="border-t border-gray-700"></div>
                    <button
                      onClick={() => {
                        navigate("/");
                        setCategoriesMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-indigo-400 hover:bg-indigo-500/20 transition font-semibold"
                    >
                      Ver todas →
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <SearchBar compact />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">

            <Link
              to="/add-game"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Plus size={18} />
              <span className="hidden xl:inline">Añadir</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenu(!profileMenu)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  <User size={18} />
                  <span>{user.username}</span>
                  <ChevronDown size={16} className={`transition-transform ${profileMenu ? "rotate-180" : ""}`} />
                </button>
                {profileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
                    <Link
                      to="/perfil"
                      onClick={() => setProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-400 transition"
                    >
                      <User size={16} />
                      <span>Mi perfil</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 text-left px-4 py-2 text-gray-200 hover:bg-red-500/20 hover:text-red-400 transition"
                    >
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-gray-300 hover:text-indigo-400 transition"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800 py-4 space-y-3 animate-fadeIn">
            <div className="px-4 mb-4">
              <SearchBar compact />
            </div>
            
            {[
              { to: "/", label: "Inicio" },
              { to: "/add-game", label: "Añadir juego" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10 font-medium transition"
              >
                {label}
              </NavLink>
            ))}

            <div className="border-t border-gray-800 pt-3">
              <div className="px-4 text-gray-500 text-xs font-semibold mb-2">CATEGORÍAS</div>
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    navigate(`/categoria/${cat.slug}`);
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10 transition"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {user ? (
              <div className="border-t border-gray-800 pt-3 px-4 space-y-2">
                <Link
                  to="/perfil"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-center rounded-lg font-semibold transition"
                >
                  Mi perfil
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="block w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-center rounded-lg font-semibold transition"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-800 pt-3 px-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-center rounded-lg font-semibold transition"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-center rounded-lg font-semibold transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
