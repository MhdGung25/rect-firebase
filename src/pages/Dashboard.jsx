import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, doc, deleteDoc, where, updateDoc 
} from "firebase/firestore";
import { signOut } from "firebase/auth";

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Notes from './Notes';
import Settings from './Settings';
import Favorites from './Favorites';
import Stats from './Stats'; 

function Dashboard({ user, namaWarung, setNamaWarung }) {
  const [notes, setNotes] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  // Real-time Fetch dari Firebase
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listData = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() 
      }));
      setNotes(listData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddNote = async (noteData) => {
    try {
      await addDoc(collection(db, "notes"), {
        title: noteData.title || "Tanpa Judul",
        content: noteData.content || "",
        isFavorite: false,
        category: noteData.category || "Umum",
        createdAt: serverTimestamp(),
        userId: user.uid 
      });
    } catch (e) { console.error("Gagal menambah:", e); }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Hapus catatan ini secara permanen?")) {
      try { 
        await deleteDoc(doc(db, "notes", id)); 
      // eslint-disable-next-line no-unused-vars
      } catch (e) { 
        alert("Gagal menghapus catatan!"); 
      }
    }
  };

  const handleToggleFavorite = async (note) => {
    try {
      const noteRef = doc(db, "notes", note.id);
      await updateDoc(noteRef, { isFavorite: !note.isFavorite });
    } catch (e) { console.error("Gagal update favorit:", e); }
  };

  // Render halaman sesuai tab
  const renderCurrentPage = () => {
    const commonProps = { 
      notes, 
      handleAddNote, 
      handleDeleteNote, 
      handleToggleFavorite, 
      loading,
      user
    };

    switch (activeTab) {
      case 'home':
        return <Notes {...commonProps} />;
      case 'favorites':
        return <Favorites {...commonProps} />;
      case 'stats':
        return <Stats notes={notes} />;
      case 'settings':
        return (
          <Settings 
            user={user} 
            onLogout={() => setShowLogoutConfirm(true)} 
            namaWarung={namaWarung} 
            setNamaWarung={setNamaWarung} 
          />
        );
      default:
        return <Notes {...commonProps} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Sidebar Navigasi */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Konten Utama */}
      <main className="flex-1 pt-20 md:pt-10 p-5 md:p-10 md:ml-64 transition-all duration-300 pb-24 md:pb-10">
        {/* Header Profil */}
        <Header userName={user?.displayName || "User"} />

        {/* Hero Section */}
        <div className="mb-10">
          <p className="text-[#7B61FF] dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">
            {namaWarung || "CatatanKu"}
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-[#1B2559] dark:text-white leading-tight">
            {activeTab === 'favorites' ? 'Koleksi' : 'Catatan'}{" "}
            <span className="text-[#7B61FF] dark:text-indigo-400">
              {activeTab === 'favorites' ? 'Favorit' : 'Digital'}
            </span>
          </h1>
        </div>

        {/* Konten Berdasarkan Tab */}
        <div className="mt-8">
          {renderCurrentPage()}
        </div>

        {/* Modal Logout */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => setShowLogoutConfirm(false)}
            />
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center relative z-10 border border-white dark:border-slate-700 animate-in fade-in zoom-in duration-200">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="text-xl font-black text-[#1B2559] dark:text-white">Ingin Keluar?</h3>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-2 mb-8">Sesi Anda akan diakhiri, namun catatan Anda tetap aman di cloud.</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => signOut(auth)} 
                  className="w-full py-4 bg-[#7B61FF] dark:bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 dark:shadow-none hover:brightness-110 active:scale-95 transition-all"
                >
                  Ya, Keluar Sekarang
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)} 
                  className="w-full py-4 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-600 transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
