import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, Plus, Home, Trophy, Info } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Tooltip from "./Tooltip";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-black/40 border-b border-gray-800 shadow-[0_0_25px_#6366f155] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center relative">
        <Link
          to="/"
          className="relative text-3xl font-extrabold tracking-tight transition-all duration-300 group"
        >
          <span className="relative z-10 bg-linear-to-r from-indigo-400 via-fuchsia-500 to-indigo-400 bg-size[:200%_auto] animate-gradient-x text-transparent bg-clip-text drop-shadow-[0_0_10px_#7c3aedaa]">
            IVDB
          </span>
          <span className="absolute inset-0 blur-lg opacity-60 bg-linear-to-r from-indigo-500 via-fuchsia-500 to-indigo-400 rounded-md scale-105 group-hover:opacity-80 transition-all duration-500"></span>
        </Link>

        <div className="hidden md:flex space-x-8 items-center">
          {[
            { to: "/", label: "Inicio" },
            { to: "/add-game", label: "Añadir juego" },
            { to: "/top", label: "Top juegos" },
            { to: "/about", label: "Acerca de" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-gray-300 font-medium hover:text-indigo-400 transition ${isActive ? "text-indigo-400" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenu(!profileMenu)}
                className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-[0_0_10px_#6366f1aa] transition"
              >
                {user.username}
                <ChevronDown className="ml-2" size={18} />
              </button>
              {profileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                  <Link
                    to="/perfil"
                    onClick={() => setProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-indigo-500 hover:text-white transition"
                  >
                    <User size={16} />
                    <span>Mi perfil</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-gray-200 hover:bg-indigo-500 hover:text-white transition"
                  >
                    <LogOut size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-[0_0_10px_#6366f1aa] transition"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold shadow-[0_0_10px_#6366f1aa] transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-300 hover:text-indigo-400 transition"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-gray-800 py-4 space-y-4 text-center animate-fadeIn">
          {[
            { to: "/", label: "Inicio" },
            { to: "/add-game", label: "Añadir juego" },
            { to: "/top", label: "Top juegos" },
            { to: "/about", label: "Acerca de" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="block text-gray-300 hover:text-indigo-400 font-medium transition"
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <>
              <Link
                to="/perfil"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-[0_0_10px_#6366f1aa] transition"
              >
                Perfil
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold shadow-[0_0_10px_#6366f1aa] transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-[0_0_10px_#6366f1aa] transition"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold shadow-[0_0_10px_#6366f1aa] transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
