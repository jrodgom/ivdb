import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { gameService } from "../services/gameService";
import { Gamepad2, Calendar, Tag, Monitor, Users, Image, FileText, Save, X, Trash2, AlertTriangle } from "lucide-react";

export default function EditGame() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    release_date: "",
    genre: "",
    platform: "",
    developer: "",
    cover_image: "",
  });

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      setIsLoading(true);
      const response = await gameService.getGameById(id);
      const game = response.data;
      
      setFormData({
        title: game.title || "",
        description: game.description || "",
        release_date: game.release_date || "",
        genre: game.genre || "",
        platform: game.platform || "",
        developer: game.developer || "",
        cover_image: game.cover_image || "",
      });
    } catch (error) {
      console.error("Error loading game:", error);
      setError("No se pudo cargar el juego");
    } finally {
      setIsLoading(false);
    }
  };

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

    if (!user?.is_staff) {
      setError("Solo los administradores pueden editar juegos");
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

      await gameService.updateGame(id, gameData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/game/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error updating game:", err);
      setError(err.response?.data?.error || "Error al actualizar el juego. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.is_staff) {
      alert("Solo los administradores pueden eliminar juegos");
      return;
    }

    setIsDeleting(true);
    try {
      await gameService.deleteGame(id);
      alert("Juego eliminado correctamente");
      navigate("/");
    } catch (err) {
      console.error("Error deleting game:", err);
      alert(err.response?.data?.error || "Error al eliminar el juego");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 pt-20 flex items-center justify-center">
        <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl p-8 max-w-md text-center">
          <Gamepad2 size={64} className="mx-auto text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso restringido</h2>
          <p className="text-gray-400 mb-6">Debes iniciar sesión como administrador</p>
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

  if (!user.is_staff) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 pt-20 flex items-center justify-center">
        <div className="bg-gray-900/80 border border-red-800/60 backdrop-blur-md rounded-2xl p-8 max-w-md text-center">
          <AlertTriangle size={64} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso denegado</h2>
          <p className="text-gray-400 mb-6">Solo los administradores pueden editar juegos</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Cargando juego...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 bg-size-[200%_200%] animate-gradient-x relative overflow-hidden">
      {/* Glow ambiental */}
      <div className="absolute inset-0 blur-3xl bg-linear-to-tr from-indigo-600/20 via-fuchsia-600/10 to-transparent pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-600/20 rounded-full mb-4">
            <Gamepad2 size={48} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-3">
            Editar Juego
          </h1>
          <p className="text-gray-400 text-lg">
            Modifica la información del juego
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-4 mb-6 animate-fadeIn">
            <p className="text-green-400 font-semibold text-center">
              ✓ ¡Juego actualizado con éxito! Redirigiendo...
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="edit-game-title">
                <Gamepad2 size={18} />
                Título del juego *
              </label>
              <input
                id="edit-game-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="edit-game-description">
                <FileText size={18} />
                Descripción
              </label>
              <textarea
                id="edit-game-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Release Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="edit-game-release-date">
                  <Calendar size={18} />
                  Fecha de lanzamiento
                </label>
                <input
                  id="edit-game-release-date"
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="edit-game-genre">
                  <Tag size={18} />
                  Género
                </label>
                <input
                  id="edit-game-genre"
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Platform */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="edit-game-platform">
                  <Monitor size={18} />
                  Plataforma
                </label>
                <input
                  id="edit-game-platform"
                  type="text"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Developer */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="edit-game-developer">
                  <Users size={18} />
                  Desarrollador
                </label>
                <input
                  id="edit-game-developer"
                  type="text"
                  name="developer"
                  value={formData.developer}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2" htmlFor="edit-game-cover-image">
                <Image size={18} />
                URL de la imagen de portada
              </label>
              <input
                id="edit-game-cover-image"
                type="url"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-3 animate-fadeIn">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || success}
                className="flex-1 py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold rounded-lg shadow-[0_0_20px_#6366f1aa] hover:shadow-[0_0_25px_#a855f7aa] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Guardar Cambios
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X size={20} />
                Cancelar
              </button>
            </div>
          </form>

          {/* Delete Section */}
          <div className="mt-8 pt-8 border-t border-red-900/30">
            <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="text-red-400" size={20} />
                <h3 className="text-lg font-bold text-red-400">Zona de peligro</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Eliminar este juego también eliminará todas las reseñas y favoritos asociados.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isSubmitting || isDeleting}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 size={18} />
                Eliminar Juego
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gray-900 border border-red-800/60 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_#dc262688]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-600/20 rounded-full">
                <Trash2 className="text-red-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white">¿Eliminar juego?</h3>
            </div>
            
            <p className="text-gray-300 mb-4">
              Esta acción es <strong className="text-red-400">permanente</strong> y no se puede deshacer.
            </p>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
              <p className="text-white font-bold">{formData.title}</p>
              <p className="text-gray-400 text-sm mt-1">
                Se eliminarán todas las reseñas, favoritos y datos asociados a este juego.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_#dc262666] disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Eliminar
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
