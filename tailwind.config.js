/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          // --- Movimiento del gradiente del logo ---
          "gradient-x": {
            "0%, 100%": { backgroundPosition: "0% center" },
            "50%": { backgroundPosition: "100% center" },
          },
  
          // --- Animación de aparición suave (para Home, etc.) ---
          fadeIn: {
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
          },
        },
  
        animation: {
          // Movimiento continuo del gradiente
          "gradient-x": "gradient-x 6s ease-in-out infinite",
  
          // Pulso más lento (ya lo tenías bien)
          "pulse-slow": "pulse 3s ease-in-out infinite",
  
          // Suave aparición
          fadeIn: "fadeIn 0.8s ease-out",
        },
  
        backgroundSize: {
          "200%": "200% auto",
        },
      },
    },
    plugins: [],
  };
  