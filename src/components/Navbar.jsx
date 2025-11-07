import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-black/40 border-b border-gray-800 shadow-[0_0_25px_#6366f155] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center relative">
        {/* === LOGO ANIMADO CON EFECTO NEÓN === */}
        <Link
          to="/"
          className="relative text-3xl font-extrabold tracking-tight transition-all duration-300 group"
        >
          {/* Capa del texto con gradiente animado */}
          <span className="relative z-10 bg-linear-to-r from-indigo-400 via-fuchsia-500 to-indigo-400 bg-size[:200%_auto] animate-gradient-x text-transparent bg-clip-text drop-shadow-[0_0_10px_#7c3aedaa]">
            IVDB
          </span>

          {/* Glow difuminado detrás del texto */}
          <span className="absolute inset-0 blur-lg opacity-60 bg-linear-to-r from-indigo-500 via-fuchsia-500 to-indigo-400 rounded-md scale-105 group-hover:opacity-80 transition-all duration-500"></span>
        </Link>

        {/* === LINKS DESKTOP === */}
        <div className="hidden md:flex space-x-8">
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
                `text-gray-300 font-medium hover:text-indigo-400 transition ${
                  isActive ? "text-indigo-400" : ""
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* === PERFIL BOTÓN === */}
        <Link
          to="/perfil"
          className="hidden md:inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-[0_0_10px_#6366f1aa] transition"
        >
          Perfil
        </Link>

        {/* === MENÚ MÓVIL === */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-300 hover:text-indigo-400 transition"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* === PANEL MÓVIL === */}
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
          <Link
            to="/perfil"
            onClick={() => setOpen(false)}
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-[0_0_10px_#6366f1aa] transition"
          >
            Perfil
          </Link>
        </div>
      )}

      {/* === RESPLANDOR INFERIOR NEÓN === */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-indigo-500 to-transparent blur-sm opacity-80"></div>
    </nav>
  );
}
