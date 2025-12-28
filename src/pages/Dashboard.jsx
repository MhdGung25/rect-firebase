import { collection, onSnapshot, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";

export default function Dashboard({ namaWarung }) {
  const [notes, setNotes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const authUnsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const q = query(
          collection(db, "notes"), 
          where("userId", "==", user.uid), 
          orderBy("createdAt", "desc")
        );

        const snapUnsub = onSnapshot(q, (snapshot) => {
          setNotes(snapshot.docs.map(d => ({ 
            id: d.id, 
            ...d.data(),
            createdAt: d.data().createdAt?.toDate() 
          })));
          setLoading(false);
        });
        return () => snapUnsub();
      } else {
        nav("/");
      }
    });
    return () => authUnsub();
  }, [nav]);

  const toggleFavorite = async (note) => {
    try {
      const noteRef = doc(db, "notes", note.id);
      await updateDoc(noteRef, {
        isFavorite: !note.isFavorite
      });
    } catch (err) {
      console.error("Error updating favorite: ", err);
    }
  };

  const getUserName = () => currentUser?.displayName || currentUser?.email?.split("@")[0] || "User";

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      {/* Penambahan md:ml-64 agar konten tidak tertutup sidebar di laptop */}
      <main className="flex-1 md:ml-64 p-5 md:p-8 transition-all duration-300">
        <Header userName={getUserName()} namaWarung={namaWarung} />

        {/* WELCOME SECTION - Responsive layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1B2559]">Halo, {getUserName()}! 👋</h2>
            <p className="text-[#A3AED0] font-medium text-sm md:text-base">Berikut adalah ringkasan catatan digital Anda hari ini.</p>
          </div>
          <button 
            onClick={() => nav("/notes")}
            className="w-full md:w-auto bg-[#7B61FF] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-purple-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Buka Semua Catatan</span>
            <span>📚</span>
          </button>
        </motion.div>

        {/* STATS AREA - Grid responsif (1 kolom di HP, 2 di Tablet, 4 di Laptop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard title="Total Catatan" value={notes.length} sub="Semua Data" icon="📁" />
          <StatCard title="Favorit" value={notes.filter(n => n.isFavorite).length} sub="Tersemat" icon="⭐" />
          <StatCard title="Minggu Ini" value={notes.filter(n => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return n.createdAt > weekAgo;
          }).length} sub="Update Terbaru" icon="📈" />
          <StatCard title="Cloud Sync" value="Aktif" sub="Terhubung" icon="☁️" />
        </div>

        {/* RIWAYAT TERBARU */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-50"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg md:text-xl font-black text-[#1B2559]">Riwayat Terkini</h3>
            <span className="text-[9px] md:text-[10px] font-black text-[#7B61FF] uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
              5 Terbaru
            </span>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-10 space-y-3">
                <div className="animate-spin text-2xl inline-block">⏳</div>
                <p className="text-slate-400 font-medium">Sinkronisasi data...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-12 md:py-16 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-slate-100">
                <p className="text-[#A3AED0] font-bold text-sm">Belum ada catatan digital.</p>
                <button 
                  onClick={() => nav("/notes")}
                  className="mt-2 text-[#7B61FF] font-black text-[10px] md:text-xs uppercase hover:underline"
                >
                  Mulai Menulis Sekarang
                </button>
              </div>
            ) : (
              notes.slice(0, 5).map((note, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={note.id} 
                  className="flex items-center justify-between p-4 md:p-5 border border-slate-50 hover:border-purple-100 hover:bg-slate-50/50 transition-all rounded-[1.2rem] md:rounded-[1.5rem] group"
                >
                  <div className="flex items-center gap-3 md:gap-4 flex-1">
                    <button 
                      onClick={() => toggleFavorite(note)}
                      className={`text-lg md:text-xl transition-all ${note.isFavorite ? 'grayscale-0 scale-110' : 'grayscale opacity-20 hover:opacity-100 hover:grayscale-0'}`}
                    >
                      ⭐
                    </button>
                    <div className="overflow-hidden">
                      <p className="text-[#1B2559] font-black text-xs md:text-sm truncate">{note.title}</p>
                      <p className="text-[10px] md:text-xs text-[#A3AED0] line-clamp-1 italic">"{note.content}"</p>
                    </div>
                  </div>
                  <div className="text-right ml-2 min-w-[60px]">
                    <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                      {note.createdAt?.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-[8px] md:text-[9px] text-slate-300 font-bold uppercase">
                      {note.createdAt?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <p className="mt-8 text-center text-[#A3AED0] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em]">
          NoteFlow Dashboard System
        </p>
      </main>
    </div>
  );
}