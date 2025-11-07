import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }
    const success = await register(username, password);
    if (success) {
      navigate("/"); // redirige al home
    } else {
      setError("Error al registrar el usuario");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 p-6 bg-gray-900 rounded-2xl shadow-lg animate-fadeIn">
      <h2 className="text-3xl font-bold text-indigo-400 mb-6 text-center">Registrarse</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <input
          type="password"
          placeholder="Repetir contraseña"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-[0_0_10px_#6366f1aa] transition"
        >
          Registrarse
        </button>
      </form>
      <p className="mt-4 text-gray-400 text-center">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
