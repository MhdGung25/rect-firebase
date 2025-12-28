import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Notes from './pages/Notes';
import Favorites from './pages/Favorites';

export default function App() {
  // Nama aplikasi default diubah menjadi tema Catatan
  const [namaWarung, setNamaWarung] = useState("My Digital Notes");

  // Efek untuk memuat nama judul yang disimpan user
  useEffect(() => {
    const savedNama = localStorage.getItem('namaWarung');
    if (savedNama) {
      // Memperbaiki bug: menambahkan setNamaWarung yang hilang sebelumnya
      (savedNama);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Login & Registrasi */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman Utama Dashboard */}
        <Route 
          path="/dashboard" 
          element={<Dashboard namaWarung={namaWarung} />} 
        />

        {/* Halaman Semua Catatan */}
        <Route 
          path="/notes" 
          element={<Notes namaWarung={namaWarung} />} 
        />

        {/* Halaman Catatan Favorit */}
        <Route 
          path="/favorites" 
          element={<Favorites namaWarung={namaWarung} />} 
        />

        {/* Halaman Pengaturan (Bisa ubah judul catatan) */}
        <Route 
          path="/settings" 
          element={
            <Settings 
              namaWarung={namaWarung} 
              setNamaWarung={setNamaWarung} 
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}