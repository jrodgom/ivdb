import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validaciones en tiempo real
  const passwordStrength = () => {
    const pass = formData.password;
    if (!pass) return null;
    
    const checks = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
    };
    
    return checks;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validaciones
    if (!formData.username.trim()) {
      setError("El nombre de usuario es requerido");
      return;
    }
    
    if (formData.username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres");
      return;
    }
    
    if (!formData.email.trim()) {
      setError("El correo electrónico es requerido");
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      setError("Ingresa un correo electrónico válido");
      return;
    }
    
    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    
    if (formData.password !== formData.password2) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(formData.username, formData.password, formData.email);
      if (success) {
        navigate("/");
      } else {
        setError("Error al registrar el usuario");
      }
    } catch (err) {
      console.error("Error en registro:", err);
      
      // Intentar parsear el error para mostrar mensaje útil
      let errorMsg = "";
      if (err.message) {
        try {
          const errorObj = JSON.parse(err.message);
          if (errorObj.username) errorMsg += `Usuario: ${errorObj.username.join(", ")}. `;
          if (errorObj.email) errorMsg += `Correo: ${errorObj.email.join(", ")}. `;
          if (errorObj.password) errorMsg += `Contraseña: ${errorObj.password.join(", ")}. `;
          if (errorObj.detail) errorMsg += errorObj.detail;
        } catch {
          errorMsg = err.message;
        }
      }
      setError(errorMsg || "Error al registrar. Verifica los datos ingresados.");
    } finally {
      setIsLoading(false);
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
          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
              minLength={3}
            />
            {formData.username && formData.username.length < 3 && (
              <p className="text-yellow-500 text-xs mt-1">Mínimo 3 caracteres</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            />
            {formData.email && !isValidEmail(formData.email) && (
              <p className="text-yellow-500 text-xs mt-1">Ingresa un correo válido</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 pr-12 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Indicadores de fortaleza */}
            {formData.password && passwordStrength() && (
              <div className="mt-2 space-y-1 text-xs">
                <div className={`flex items-center gap-1 ${passwordStrength().length ? 'text-green-400' : 'text-gray-500'}`}>
                  {passwordStrength().length ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength().uppercase ? 'text-green-400' : 'text-gray-500'}`}>
                  {passwordStrength().uppercase ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  <span>Una mayúscula</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength().lowercase ? 'text-green-400' : 'text-gray-500'}`}>
                  {passwordStrength().lowercase ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  <span>Una minúscula</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength().number ? 'text-green-400' : 'text-gray-500'}`}>
                  {passwordStrength().number ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  <span>Un número</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                name="password2"
                placeholder="Confirmar contraseña"
                value={formData.password2}
                onChange={handleChange}
                className="w-full p-3 pr-12 rounded-lg bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
              >
                {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.password2 && formData.password !== formData.password2 && (
              <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
            )}
            {formData.password2 && formData.password === formData.password2 && (
              <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                <CheckCircle size={14} /> Las contraseñas coinciden
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-linear-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-semibold rounded-lg shadow-[0_0_20px_#6366f1aa] hover:shadow-[0_0_25px_#a855f7aa] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registrando..." : "Crear cuenta"}
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
