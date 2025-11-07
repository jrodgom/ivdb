import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CategoryPage from "./pages/CategoryPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Perfil from "./pages/Perfil";
import { AuthProvider } from "./context/AuthContext"; // si ya lo creaste

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria/:categoria" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}
