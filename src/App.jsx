import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Perfil = lazy(() => import("./pages/Perfil"));
const GameDetail = lazy(() => import("./pages/GameDetail"));
const AddGame = lazy(() => import("./pages/AddGame"));
const EditGame = lazy(() => import("./pages/EditGame"));
const NotFound = lazy(() => import("./pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-indigo-950 to-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
      <p className="text-gray-400">Cargando...</p>
    </div>
  </div>
); // si ya lo creaste

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/categoria/:categoria" element={<CategoryPage />} />
              <Route path="/game/:id" element={<GameDetail />} />
              <Route path="/game/:id/edit" element={<EditGame />} />
              <Route path="/add-game" element={<AddGame />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}
