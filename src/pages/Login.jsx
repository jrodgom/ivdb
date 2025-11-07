import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate("/");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 bg-[length:200%_200%] animate-gradient-x relative overflow-hidden">
      
      {/* Glow difuminado detrás del login */}
      <div className="absolute inset-0 blur-3xl bg-gradient-to-tr from-indigo-600/20 via-fuchsia-600/10 to-transparent"></div>

      {/* Contenedor principal del login */}
      <div className="relative w-full max-w-md h-[520px] flex flex-col justify-center p-8 bg-gray-900/90 rounded-2xl shadow-[0_0_25px_#6366f155] backdrop-blur-xl animate-fadeIn border border-gray-800">
        
        {/* Logo o título */}
        <div className="flex justify-center mb-4">
          <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500 animate-pulse-slow">
            IVDB
          </div>
        </div>

        <h2 className="text-2xl font-bold text-indigo-400 mb-6 text-center">
          Iniciar sesión
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 flex-grow flex flex-col justify-center">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-[0_0_10px_#6366f1aa] transition"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-gray-400 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
