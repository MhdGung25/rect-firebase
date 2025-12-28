import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

export default function Favorites({ namaWarung }) {
  const [favNotes, setFavNotes] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email.split("@")[0]);
        
        // Menambahkan orderBy agar catatan favorit terbaru muncul di atas
        const q = query(
          collection(db, "notes"),
          where("userId", "==", user.uid),
          where("isFavorite", "==", true),
          orderBy("createdAt", "desc")
        );

        const unsubNotes = onSnapshot(q, (snapshot) => {
          setFavNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        }, (error) => {
          console.error("Error fetching favorites:", error);
          setLoading(false);
        });

        return () => unsubNotes();
      }
    });
    return () => unsubAuth();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />
      
      {/* Penambahan md:ml-64 agar konten tidak tertutup sidebar di laptop */}
      <main className="flex-1 md:ml-64 p-5 md:p-8 transition-all duration-300">
        <Header userName={userName} namaWarung={namaWarung} />

        {/* Judul Halaman & Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-xl md:text-2xl font-black text-[#1B2559]">⭐ Catatan Favorit</h3>
            <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm shadow-yellow-200">
              {favNotes.length} Tersemat
            </span>
          </div>
        </motion.div>

        {/* Grid Catatan Favorit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Loading State
              <div className="col-span-full text-center py-20">
                <div className="animate-spin text-3xl inline-block mb-3">⏳</div>
                <p className="text-slate-400 font-medium italic">Memuat favorit...</p>
              </div>
            ) : favNotes.length > 0 ? (
              favNotes.map((note, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  key={note.id} 
                  className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-yellow-50 hover:border-yellow-200 transition-all relative overflow-hidden group hover:shadow-xl hover:shadow-yellow-100/50"
                >
                  {/* Dekorasi Bintang Pojok */}
                  <div className="absolute top-0 right-0 p-4 transform group-hover:rotate-12 transition-transform">
                    <span className="text-yellow-400 text-2xl drop-shadow-sm">⭐</span>
                  </div>

                  <h4 className="text-[#1B2559] font-bold text-lg mb-3 pr-8 line-clamp-1">{note.title}</h4>
                  <p className="text-[#A3AED0] text-sm line-clamp-4 leading-relaxed italic">
                    "{note.content}"
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                          Dibuat pada
                        </span>
                        <span className="text-[10px] font-bold text-[#7B61FF]">
                          {note.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                     </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty State
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20 md:py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100"
              >
                <div className="text-5xl md:text-6xl mb-4">✨</div>
                <p className="text-[#1B2559] font-black text-lg md:text-xl italic">Belum ada catatan favorit.</p>
                <p className="text-[#A3AED0] text-sm mt-1 px-6">Tandai bintang pada catatan pentingmu agar muncul di sini!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <p className="mt-12 text-center text-[#A3AED0] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em]">
          NoteFlow Favorites Gallery
        </p>
      </main>
    </div>
  );
}