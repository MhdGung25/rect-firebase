import { useState } from "react";
import { auth } from "../firebase";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol Hamburger - Muncul di HP */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-[70] md:hidden bg-[#7B61FF] p-3 rounded-2xl shadow-lg text-white"
      >
        {isOpen ? "✕" : "☰"}
      </motion.button>

      {/* Overlay Gelap untuk Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-[50] md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Utama */}
      <aside className={`
        w-64 bg-[#7B61FF] text-white flex flex-col p-6 fixed h-full z-[60] shadow-2xl transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}>
        
        {/* Logo Aplikasi */}
        <div className="flex items-center gap-3 mb-12">
          <motion.div 
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="bg-white/20 p-2 rounded-xl text-xl"
          >
            📝
          </motion.div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">NoteFlow</h1>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 space-y-2">
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
            <NavItem icon="🏠" label="Overview" active={location.pathname === "/dashboard"} />
          </Link>
          <Link to="/notes" onClick={() => setIsOpen(false)}>
            <NavItem icon="📚" label="Semua Catatan" active={location.pathname === "/notes"} />
          </Link>
          <Link to="/favorites" onClick={() => setIsOpen(false)}>
            <NavItem icon="⭐" label="Favorit" active={location.pathname === "/favorites"} />
          </Link>

          {/* Menambahkan Menu Pengaturan sebagai pengganti Logout di Sidebar */}
          <Link to="/settings" onClick={() => setIsOpen(false)}>
            <NavItem icon="⚙️" label="Pengaturan" active={location.pathname === "/settings"} />
          </Link>
        </nav>

        {/* Bagian bawah dikosongkan karena Logout pindah ke Settings */}
        <div className="mt-auto pt-6 border-t border-white/10 text-[10px] text-white/40 font-bold uppercase tracking-widest text-center">
          v1.0.0 Stable
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ${
        active 
        ? "bg-white text-[#7B61FF] font-black shadow-lg" 
        : "hover:bg-white/10 opacity-70"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm tracking-wide">{label}</span>
      
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="ml-auto w-1.5 h-1.5 bg-[#7B61FF] rounded-full" 
        />
      )}
    </motion.div>
  );
}