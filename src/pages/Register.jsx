import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    try {
      const success = await register(username, password);
      if (success) {
        navigate("/");
      } else {
        setError("Error al registrar el usuario");
      }
    } catch (err) {
      console.error("Error en registro:", err);
      
      // Intentar parsear el error para mostrar mensaje útil
      let errorMsg = "Error al registrar. ";
      if (err.message) {
        try {
          const errorObj = JSON.parse(err.message);
          if (errorObj.username) errorMsg += `Usuario: ${errorObj.username.join(", ")}. `;
          if (errorObj.password) errorMsg += `Contraseña: ${errorObj.password.join(", ")}. `;
          if (errorObj.detail) errorMsg += errorObj.detail;
        } catch {
          errorMsg += err.message;
        }
      }
      setError(errorMsg || "Verifica la consola para más detalles.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 bg-size-[200%_200%] animate-gradient-x relative overflow-x-hidden">
      {/* Glow ambiental */}
      <div className="absolute inset-0 blur-3xl bg-linear-to-tr from-indigo-600/20 via-fuchsia-600/10 to-transparent pointer-events-none"></div>

      {/* Tarjeta principal */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] animate-fadeIn">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 animate-pulse-slow">
            IVDB
          </h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-200 mb-6 text-center">
          Crear cuenta
        </h2>

        {error && (
          <p className="text-red-500 bg-red-500/10 border border-red-500/20 p-2 rounded-md text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            required
          />
          <input
            type="password"
            placeholder="Repetir contraseña"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-semibold rounded-lg shadow-[0_0_20px_#6366f1aa] hover:shadow-[0_0_25px_#a855f7aa] transition-all duration-300"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-6 text-gray-400 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
