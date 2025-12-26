import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Impor Register yang tadi kita buat
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Utama (Login) */}
        <Route path="/" element={<Login />} />
        
        {/* Halaman Register */}
        <Route path="/register" element={<Register />} />
        
        {/* Halaman Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}