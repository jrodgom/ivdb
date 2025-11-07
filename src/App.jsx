import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CategoryPage from "./pages/CategoryPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:categoria" element={<CategoryPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
