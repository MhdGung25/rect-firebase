import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Settings({ namaWarung, setNamaWarung }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tempNama, setTempNama] = useState(namaWarung);
  const nav = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        nav("/");
      }
    });
    return () => unsub();
  }, [nav]);

  const handleSave = () => {
    const namaBersih = tempNama.trim();
    if (namaBersih === "") {
      alert("Judul tidak boleh kosong!");
      setTempNama(namaWarung);
      return;
    }
    setNamaWarung(namaBersih);
    localStorage.setItem('namaWarung', namaBersih);
    setIsEditing(false);
  };

  const handleLogout = () => {
    signOut(auth).then(() => nav("/"));
  };

  const getUserName = () => currentUser?.displayName || currentUser?.email?.split("@")[0] || "User";

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      {/* Konten Utama - Responsive margin */}
      <main className="flex-1 md:ml-64 p-5 md:p-8 transition-all duration-300">
        <Header userName={getUserName()} namaWarung={namaWarung} />

        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Header Halaman */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2"
          >
            <h2 className="text-2xl font-black text-[#1B2559]">⚙️ Pengaturan</h2>
            <p className="text-[#A3AED0] text-sm font-medium">Kelola akun dan preferensi digital Anda.</p>
          </motion.div>

          {/* Section 1: Profil Pengguna */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-50 text-center"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#7B61FF]/10 text-3xl md:text-4xl flex items-center justify-center rounded-full mx-auto mb-4 border-4 border-white shadow-md">
              ✍️
            </div>
            <h3 className="text-lg md:text-xl font-black text-[#1B2559] uppercase tracking-tight">
              {getUserName()}
            </h3>
            <p className="text-[#A3AED0] text-xs md:text-sm font-medium mb-4 truncate px-4">{currentUser?.email}</p>
            <div className="inline-block px-4 py-1.5 bg-green-50 text-green-500 text-[9px] md:text-[10px] font-black uppercase rounded-full">
              Status: Akun Aktif
            </div>
          </motion.div>

          {/* Section 2: Konfigurasi App */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-50 space-y-6"
          >
            <h4 className="text-[10px] font-black text-[#A3AED0] uppercase tracking-[0.2em]">
              Personalisasi Aplikasi
            </h4>
            
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div 
                    key="editing"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col gap-3"
                  >
                    <label className="text-[10px] font-bold text-[#7B61FF] uppercase ml-2">Judul Koleksi Catatan</label>
                    <input 
                      type="text" 
                      value={tempNama} 
                      onChange={(e) => setTempNama(e.target.value)}
                      className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-[#7B61FF] outline-none font-bold text-[#1B2559] text-sm"
                      placeholder="Contoh: My Daily Journal"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSave} 
                        className="flex-1 bg-[#7B61FF] text-white py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-purple-100 active:scale-95 transition-all"
                      >
                        Simpan
                      </button>
                      <button 
                        onClick={() => { setIsEditing(false); setTempNama(namaWarung); }} 
                        className="px-6 bg-slate-100 text-slate-400 py-3.5 rounded-2xl font-bold text-[10px] uppercase active:scale-95 transition-all"
                      >
                        Batal
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button 
                    key="static"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setIsEditing(true)}
                    className="w-full p-5 md:p-6 bg-slate-50 text-slate-600 rounded-2xl font-bold text-left flex justify-between items-center group hover:bg-slate-100 transition-all border border-transparent hover:border-purple-100"
                  >
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#A3AED0] uppercase mb-1 text-left">Judul Aktif:</span>
                      <span className="text-[#1B2559] text-base md:text-lg font-bold truncate max-w-[150px] md:max-w-full italic">"{namaWarung}"</span>
                    </div>
                    <span className="text-[#7B61FF] font-black text-[9px] md:text-xs uppercase flex items-center gap-2 whitespace-nowrap ml-2">
                      Edit 📝
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-slate-100">
              <button 
                onClick={() => setShowLogoutModal(true)} 
                className="w-full p-4 md:p-5 bg-red-50 text-red-500 rounded-2xl font-black text-center hover:bg-red-500 hover:text-white transition-all uppercase text-[10px] tracking-widest active:scale-95 shadow-sm flex items-center justify-center gap-2"
              >
                Keluar Sesi 🚪
              </button>
            </div>
          </motion.div>

          <p className="text-center text-[#A3AED0] text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
            NoteFlow v1.0.0 — Digital Productivity
          </p>
        </div>
      </main>

      {/* MODAL KONFIRMASI LOGOUT */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-[#1B2559]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center relative z-10"
            >
              <div className="text-5xl mb-4">📢</div>
              <h3 className="text-xl font-black text-[#1B2559] mb-2">Konfirmasi Keluar</h3>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                Apakah Anda yakin ingin mengakhiri sesi catatan digital Anda?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg shadow-red-100"
                >
                  Ya, Keluar
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}