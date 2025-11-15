import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { User, Mail, Calendar, Edit2, Save, X } from "lucide-react";

export default function Perfil() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    // TODO: Llamar API para actualizar perfil
    // await authService.updateProfile(formData);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
    });
    setIsEditing(false);
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
                <span className="text-white text-xs font-bold">LV {Math.floor(Math.random() * 50) + 1}</span>
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
                Miembro desde {new Date().toLocaleDateString()}
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
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
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
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
              ) : (
                <p className="text-gray-100 p-3 bg-gray-800/50 rounded-lg">{user.email || "No especificado"}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                Biografía
              </label>
              {isEditing ? (
                <textarea
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
          <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-xl p-6 text-center shadow-[0_0_15px_#000a]">
            <p className="text-3xl font-bold text-indigo-400 mb-2">0</p>
            <p className="text-gray-400 text-sm">Juegos favoritos</p>
          </div>
          <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-xl p-6 text-center shadow-[0_0_15px_#000a]">
            <p className="text-3xl font-bold text-fuchsia-400 mb-2">0</p>
            <p className="text-gray-400 text-sm">Reseñas escritas</p>
          </div>
          <div className="bg-gray-900/80 border border-gray-800/60 backdrop-blur-md rounded-xl p-6 text-center shadow-[0_0_15px_#000a]">
            <p className="text-3xl font-bold text-indigo-400 mb-2">0</p>
            <p className="text-gray-400 text-sm">Listas creadas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
  