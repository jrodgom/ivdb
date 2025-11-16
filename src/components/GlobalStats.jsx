import { useState, useEffect } from "react";
import { Gamepad2, MessageSquare, Users, Layers } from "lucide-react";
import { gameService } from "../services/gameService";

export default function GlobalStats() {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalReviews: 0,
    totalUsers: 0,
    totalGenres: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const result = await gameService.getGames("", 1, 1, {});
      const totalGames = result.total || 0;

      // Obtener una muestra de juegos para contar géneros únicos
      const gamesResult = await gameService.getGames("", 1, 100, {});
      const games = gamesResult.data || [];
      
      const uniqueGenres = new Set();
      let totalReviews = 0;
      
      games.forEach(game => {
        if (game.genre) {
          game.genre.split(',').forEach(g => {
            uniqueGenres.add(g.trim().toLowerCase());
          });
        }
        totalReviews += game.review_count || 0;
      });

      setStats({
        totalGames,
        totalReviews,
        totalUsers: 156, // Placeholder - puedes conectar con API de usuarios
        totalGenres: uniqueGenres.size,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      icon: Gamepad2, 
      label: "Juegos", 
      value: stats.totalGames,
      color: "from-indigo-500 to-purple-600",
      iconColor: "text-indigo-400"
    },
    { 
      icon: MessageSquare, 
      label: "Reseñas", 
      value: stats.totalReviews,
      color: "from-fuchsia-500 to-pink-600",
      iconColor: "text-fuchsia-400"
    },
    { 
      icon: Users, 
      label: "Usuarios", 
      value: stats.totalUsers,
      color: "from-cyan-500 to-blue-600",
      iconColor: "text-cyan-400"
    },
    { 
      icon: Layers, 
      label: "Géneros", 
      value: stats.totalGenres,
      color: "from-violet-500 to-purple-600",
      iconColor: "text-violet-400"
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 animate-pulse">
            <div className="h-12 bg-gray-800 rounded mb-3"></div>
            <div className="h-8 bg-gray-800 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="group relative bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20 overflow-hidden"
        >
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
          
          <div className="relative z-10">
            <stat.icon className={`${stat.iconColor} mb-3`} size={32} strokeWidth={2} />
            <div className="text-3xl md:text-4xl font-black text-white mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
          </div>

          {/* Decorative element */}
          <div className={`absolute -right-8 -bottom-8 w-24 h-24 bg-linear-to-br ${stat.color} opacity-10 rounded-full blur-2xl`}></div>
        </div>
      ))}
    </div>
  );
}
