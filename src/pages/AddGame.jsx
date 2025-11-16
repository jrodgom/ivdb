import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Gamepad2, Upload, Calendar, Tag, Monitor, Users, Image, FileText, Save, X } from "lucide-react";
import { fetchWithAuth } from "../utils/apiClient";

export default function AddGame() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    release_date: "",
    genre: "",
    platform: "",
    developer: "",
    cover_image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    if (!user) {
      setError("Debes iniciar sesión para añadir un juego");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const gameData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        release_date: formData.release_date || null,
        genre: formData.genre.trim(),
        platform: formData.platform.trim(),
        developer: formData.developer.trim(),
        cover_image: formData.cover_image.trim(),
      };

      const response = await fetchWithAuth(`/game/games/`, {
        method: "POST",
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title?.[0] || "Error al añadir el juego");
      }

      const newGame = await response.json();
      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/game/${newGame.id}`);
      }, 2000);
    } catch (err) {
      console.error("Error adding game:", err);
      setError(err.message || "Error al añadir el juego. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      release_date: "",
      genre: "",
      platform: "",
      developer: "",
      cover_image: "",
    });
    setError("");
    setSuccess(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 pt-20 flex items-center justify-center">
        <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl p-8 max-w-md text-center">
          <Gamepad2 size={64} className="mx-auto text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso restringido</h2>
          <p className="text-gray-400 mb-6">Debes iniciar sesión para añadir juegos</p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold rounded-lg shadow-[0_0_20px_#6366f1aa] transition-all duration-300"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 bg-size-[200%_200%] animate-gradient-x relative overflow-hidden">
      <div className="absolute inset-0 blur-3xl bg-linear-to-tr from-indigo-600/20 via-fuchsia-600/10 to-transparent pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-600/20 rounded-full mb-4">
            <Gamepad2 size={48} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-3">
            Añadir Nuevo Juego
          </h1>
          <p className="text-gray-400 text-lg">
            Comparte tus juegos favoritos con la comunidad
          </p>
        </div>

        {success && (
          <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-4 mb-6 animate-fadeIn">
            <p className="text-green-400 font-semibold text-center">
              ¡Juego añadido con éxito! Redirigiendo...
            </p>
          </div>
        )}

        <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="add-game-title">
                <Gamepad2 size={18} />
                Título del juego *
              </label>
              <input
                id="add-game-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: The Legend of Zelda: Breath of the Wild"
                required
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="add-game-description">
                <FileText size={18} />
                Descripción
              </label>
              <textarea
                id="add-game-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Escribe una descripción del juego..."
                rows={5}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="add-game-release-date">
                  <Calendar size={18} />
                  Fecha de lanzamiento
                </label>
                <input
                  id="add-game-release-date"
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="add-game-genre">
                  <Tag size={18} />
                  Género
                </label>
                <input
                  id="add-game-genre"
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="Ej: RPG, Action, Adventure"
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="add-game-platform">
                  <Monitor size={18} />
                  Plataforma
                </label>
                <input
                  id="add-game-platform"
                  type="text"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  placeholder="Ej: PlayStation, Xbox, PC"
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="add-game-developer">
                  <Users size={18} />
                  Desarrollador
                </label>
                <input
                  id="add-game-developer"
                  type="text"
                  name="developer"
                  value={formData.developer}
                  onChange={handleChange}
                  placeholder="Ej: Nintendo, Rockstar Games"
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="add-game-cover-image">
                <Image size={18} />
                URL de la imagen de portada
              </label>
              <input
                id="add-game-cover-image"
                type="url"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              {formData.cover_image && (
                <div className="mt-3">
                  <p className="text-gray-400 text-sm mb-2">Vista previa:</p>
                  <img
                    src={formData.cover_image}
                    alt="Preview"
                    className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-700"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3 animate-fadeIn">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || success}
                className="flex-1 py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold rounded-lg shadow-[0_0_20px_#6366f1aa] hover:shadow-[0_0_25px_#a855f7aa] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Añadiendo...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Añadir Juego
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X size={20} />
                Limpiar
              </button>
            </div>

            <p className="text-gray-500 text-sm text-center mt-4">
              * Campos obligatorios
            </p>
          </form>
        </div>

        <div className="mt-6 bg-indigo-900/20 border border-indigo-800/40 rounded-xl p-4">
          <p className="text-indigo-300 text-sm">
            <strong>Consejo:</strong> Asegúrate de que la información sea correcta antes de añadir el juego. 
            Los usuarios podrán valorar y comentar sobre este juego.
          </p>
        </div>
      </div>
    </div>
  );
}
