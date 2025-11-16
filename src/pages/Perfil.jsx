import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { reviewService } from "../services/reviewService";
import { User, Mail, Calendar, Edit2, Save, X, Trash2, AlertTriangle, Star, MessageSquare, Heart, Gamepad2 } from "lucide-react";

export default function Perfil() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    password: "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [myFavorites, setMyFavorites] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        password: "",
      });
      
      // Cargar reseñas y favoritos del usuario
      loadMyReviews();
      loadMyFavorites();
    }
  }, [user]);

  const loadMyReviews = async () => {
    try {
      const reviews = await reviewService.getMyReviews();
      setMyReviews(reviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const loadMyFavorites = async () => {
    try {
      const { favoriteService } = await import("../services/favoriteService");
      const favorites = await favoriteService.getMyFavorites();
      console.log("Favoritos cargados:", favorites);
      setMyFavorites(favorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const handleGameClick = async (e, gameTitle) => {
    e.preventDefault();
    try {
      const { rawgService } = await import("../services/rawgService");
      const searchResults = await rawgService.searchGames(gameTitle, 1, 1);
      
      if (searchResults.results && searchResults.results.length > 0) {
        const rawgGame = searchResults.results[0];
        navigate(`/game/${rawgGame.id}`);
      } else {
        alert(`No se encontró "${gameTitle}" en la base de datos global.`);
      }
    } catch (error) {
      console.error("Error buscando juego:", error);
      alert("Error al buscar el juego");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const { authService } = await import("../services/authService");
      
      // Preparar datos para enviar (solo enviar password si se cambió)
      const updateData = {
        email: formData.email,
        bio: formData.bio,
      };
      
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }
      
      await authService.updateProfile(updateData);
      
      // Limpiar el campo de contraseña después de guardar
      setFormData(prev => ({ ...prev, password: "" }));
      
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Recargar el perfil para obtener los datos actualizados
      window.location.reload();
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Error al actualizar el perfil. Por favor intenta de nuevo.");
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
      password: "",
    });
    setIsEditing(false);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user.username) {
      alert("El nombre de usuario no coincide");
      return;
    }
    
    try {
      const { authService } = await import("../services/authService");
      await authService.deleteAccount();
      logout();
      navigate("/");
    } catch (err) {
      console.error("Error eliminando cuenta:", err);
      alert("Error al eliminar la cuenta. Por favor intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900 bg-size-[200%_200%] animate-gradient-x relative overflow-hidden">
      {/* Glow ambiental */}
      <div className="absolute inset-0 blur-3xl bg-linear-to-tr from-indigo-600/20 via-fuchsia-600/10 to-transparent"></div>

      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 animate-fadeIn">
        {/* Header con avatar */}
        <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_30px_#6366f1aa]">
                <User size={64} className="text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-indigo-500 rounded-full p-2 shadow-lg">
                <span className="text-white text-xs font-bold">LV {Math.min(Math.floor(myReviews.length / 5) + 1, 99)}</span>
              </div>
            </div>

            {/* Info básica */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-fuchsia-500 mb-2">
                {user.username}
              </h1>
              <p className="text-gray-400 flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Mail size={16} />
                {user.email || "correo@ejemplo.com"}
              </p>
              <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2 text-sm">
                <Calendar size={16} />
                Miembro desde {user.date_joined ? new Date(user.date_joined).toLocaleDateString('es-ES') : 'Fecha desconocida'}
              </p>
            </div>

            {/* Botón editar */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-[0_0_15px_#6366f1aa] hover:shadow-[0_0_25px_#6366f1aa] transition-all duration-300 flex items-center gap-2"
              >
                <Edit2 size={18} />
                Editar perfil
              </button>
            )}
          </div>
        </div>

        {/* Mensaje de éxito */}
        {saveSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 animate-fadeIn">
            <p className="text-green-400 text-center font-semibold">✓ Perfil actualizado correctamente</p>
          </div>
        )}

        {/* Contenido principal */}
        <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl shadow-[0_0_25px_#000a] p-8">
          <h2 className="text-2xl font-bold text-indigo-400 mb-6">Información personal</h2>

          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                Nombre de usuario
              </label>
              {isEditing ? (
                <input
                  id="profile-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
              ) : (
                <p className="text-gray-100 p-3 bg-gray-800/50 rounded-lg">{user.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                Correo electrónico
              </label>
              {isEditing ? (
                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
              ) : (
                <p className="text-gray-100 p-3 bg-gray-800/50 rounded-lg">{user.email || "No especificado"}</p>
              )}
            </div>

            {/* Password (solo visible en modo edición) */}
            {isEditing && (
              <div>
                <label className="block text-gray-300 font-semibold mb-2">
                  Nueva contraseña
                </label>
                <input
                  id="profile-new-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Dejar en blanco para mantener la actual"
                  autoComplete="new-password"
                  className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
                <p className="text-gray-400 text-sm mt-1">Solo completa este campo si deseas cambiar tu contraseña</p>
              </div>
            )}

            {/* Bio */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                Biografía
              </label>
              {isEditing ? (
                <textarea
                  id="profile-bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Cuéntanos sobre ti..."
                  className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 resize-none"
                />
              ) : (
                <p className="text-gray-100 p-3 bg-gray-800/50 rounded-lg min-h-[100px]">
                  {user.bio || "Aún no has escrito tu biografía."}
                </p>
              )}
            </div>

            {/* Botones de acción en modo edición */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-semibold rounded-lg shadow-[0_0_20px_#6366f1aa] hover:shadow-[0_0_25px_#a855f7aa] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Guardar cambios
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas del usuario */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-xl p-6 text-center shadow-[0_0_15px_#000a] hover:border-indigo-500/50 transition-all duration-300 cursor-default group">
            <Heart className="mx-auto mb-3 text-red-400 fill-red-400 group-hover:scale-110 transition-transform" size={32} />
            <p className="text-3xl font-bold text-indigo-400 mb-2">{myFavorites.length}</p>
            <p className="text-gray-400 text-sm">Juegos favoritos</p>
          </div>
          <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-xl p-6 text-center shadow-[0_0_15px_#000a] hover:border-fuchsia-500/50 transition-all duration-300 cursor-default group">
            <MessageSquare className="mx-auto mb-3 text-fuchsia-400 group-hover:scale-110 transition-transform" size={32} />
            <p className="text-3xl font-bold text-fuchsia-400 mb-2">{myReviews.length}</p>
            <p className="text-gray-400 text-sm">Reseñas escritas</p>
          </div>
          <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-xl p-6 text-center shadow-[0_0_15px_#000a] hover:border-indigo-500/50 transition-all duration-300 cursor-default group">
            <Gamepad2 className="mx-auto mb-3 text-indigo-400 group-hover:scale-110 transition-transform" size={32} />
            <p className="text-3xl font-bold text-indigo-400 mb-2">LV {Math.min(Math.floor(myReviews.length / 5) + 1, 99)}</p>
            <p className="text-gray-400 text-sm">Nivel de jugador</p>
          </div>
        </div>

        {/* Mis Favoritos */}
        {myFavorites.length > 0 && (
          <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl p-8 mt-6 shadow-[0_0_15px_#000a] animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="text-red-400 fill-red-400" size={24} />
              <h2 className="text-2xl font-bold text-red-400">Tus Favoritos</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {myFavorites.map((favorite) => (
                <div
                  key={favorite.id}
                  onClick={(e) => handleGameClick(e, favorite.game_details?.title || "Juego")}
                  className="group relative overflow-hidden rounded-lg border border-gray-800 hover:border-red-500/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-3/4 relative">
                    {favorite.game_details?.cover_image ? (
                      <img
                        src={favorite.game_details.cover_image}
                        alt={favorite.game_details.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Gamepad2 className="text-gray-600" size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 right-2">
                      <Heart className="text-red-500 fill-red-500" size={20} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black to-transparent">
                    <h3 className="font-bold text-white text-sm truncate">
                      {favorite.game_details?.title || "Juego"}
                    </h3>
                    {favorite.game_details?.genre && (
                      <p className="text-gray-400 text-xs truncate">
                        {favorite.game_details.genre}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mis Reseñas */}
        {myReviews.length > 0 && (
          <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl p-8 mt-6 shadow-[0_0_15px_#000a] animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-indigo-400" size={24} />
              <h2 className="text-2xl font-bold text-indigo-400">Tus Reseñas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReviews.map((review) => (
                <div
                  key={review.id}
                  onClick={(e) => handleGameClick(e, review.game_details?.title || "Juego desconocido")}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    {review.game_details?.cover_image && (
                      <img
                        src={review.game_details.cover_image}
                        alt={review.game_details.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white group-hover:text-indigo-400 truncate mb-1 transition-colors">
                        {review.game_details?.title || "Juego desconocido"}
                      </h3>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Star className="fill-yellow-400 text-yellow-400" size={16} />
                          <span className="text-yellow-400 font-bold">{review.rating}/10</span>
                          {review.game_details?.genre && (
                            <span className="text-gray-500 text-xs">• {review.game_details.genre}</span>
                          )}
                        </div>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (window.confirm('¿Eliminar esta reseña?')) {
                              try {
                                await reviewService.deleteReview(review.id);
                                await loadMyReviews();
                              } catch (error) {
                                console.error("Error:", error);
                                alert("Error al eliminar reseña");
                              }
                            }
                          }}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors group/delete"
                          title="Eliminar reseña"
                        >
                          <Trash2 size={14} className="text-gray-500 group-hover/delete:text-red-400 transition-colors" />
                        </button>
                      </div>
                      {review.comment && (
                        <p className="text-gray-400 text-sm line-clamp-2 italic">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configuración de cuenta */}
        <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-2xl p-8 mt-6 shadow-[0_0_15px_#000a]">
          <h2 className="text-2xl font-bold text-gray-300 mb-6">Configuración de cuenta</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                    <Trash2 className="text-gray-400" size={20} />
                    Eliminar cuenta
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Esta acción es permanente y eliminará todos tus datos, reseñas y favoritos.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600/20 border border-red-600/50 hover:border-red-600 text-red-400 hover:text-red-300 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-red-800/60 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_#00000a] animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500" size={32} />
                <h3 className="text-2xl font-bold text-red-400">¿Estás seguro?</h3>
              </div>
              
              <p className="text-gray-300 mb-4">
                Esta acción es <strong className="text-red-400">permanente</strong> y eliminará:
              </p>
              
              <ul className="list-disc list-inside text-gray-400 mb-6 space-y-1">
                <li>Tu perfil y toda tu información</li>
                <li>Tus reseñas y calificaciones</li>
                <li>Tus listas de juegos</li>
                <li>Todo tu historial en la plataforma</li>
              </ul>
              
              <p className="text-gray-300 mb-2">
                Para confirmar, escribe tu nombre de usuario: <strong className="text-indigo-400">{user.username}</strong>
              </p>
              
              <input
                id="delete-confirmation"
                name="deleteConfirmation"
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Escribe tu nombre de usuario"
                autoComplete="off"
                className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== user.username}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Eliminar cuenta
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                  }}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  