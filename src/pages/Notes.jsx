import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { db, auth } from '../firebase';
import { 
  collection, query, where, onSnapshot, orderBy, 
  doc, deleteDoc, updateDoc, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notes({ namaWarung }) {
  const [notes, setNotes] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email.split("@")[0]);
        
        const q = query(
          collection(db, "notes"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const unsubNotes = onSnapshot(q, (snapshot) => {
          setNotes(snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          })));
          setLoading(false);
        });
        return () => unsubNotes();
      }
    });
    return () => unsubAuth();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      await addDoc(collection(db, "notes"), {
        title: newTitle,
        content: newContent,
        userId: auth.currentUser.uid,
        isFavorite: false,
        createdAt: serverTimestamp()
      });
      setNewTitle("");
      setNewContent("");
      setShowAddModal(false);
    } catch (err) {
      alert("Gagal menambah: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus catatan ini selamanya?")) {
      try {
        await deleteDoc(doc(db, "notes", id));
      } catch (err) {
        alert("Gagal menghapus: " + err.message);
      }
    }
  };

  const toggleFavorite = async (note) => {
    try {
      await updateDoc(doc(db, "notes", note.id), {
        isFavorite: !note.isFavorite
      });
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (note) => {
    setEditingNote(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "notes", editingNote), {
        title: editTitle,
        content: editContent,
        updatedAt: serverTimestamp()
      });
      setEditingNote(null);
    } catch (err) {
      alert("Gagal memperbarui: " + err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-5 md:p-8 transition-all duration-300">
        <Header userName={userName} namaWarung={namaWarung} />

        {/* Judul & Tombol Tambah Desktop */}
        <div className="mb-8 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="text-xl md:text-2xl font-black text-[#1B2559] flex items-center gap-3">
              📚 Semua Catatan
              <span className="bg-[#7B61FF]/10 text-[#7B61FF] px-3 py-1 rounded-full text-[10px] font-black uppercase">
                {notes.length} Total
              </span>
            </h3>
          </motion.div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="hidden md:flex items-center gap-2 bg-[#7B61FF] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-purple-100 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Tambah Catatan Baru</span>
            <span>+</span>
          </button>
        </div>

        {/* Grid Catatan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {notes.length > 0 ? (
              notes.map((note) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={note.id} 
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col justify-between group hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">
                        {note.createdAt?.toDate() ? note.createdAt.toDate().toLocaleDateString('id-ID') : '...'}
                      </span>
                      <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toggleFavorite(note)} className={`p-2 rounded-full ${note.isFavorite ? 'text-yellow-500 bg-yellow-50' : 'text-slate-300 hover:bg-slate-100'}`}>
                          ⭐
                        </button>
                        <button onClick={() => startEdit(note)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(note.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                          🗑️
                        </button>
                      </div>
                    </div>
                    <h4 className="text-[#1B2559] font-bold text-lg mb-2 line-clamp-1">{note.title}</h4>
                    <p className="text-[#A3AED0] text-sm line-clamp-4 leading-relaxed italic italic whitespace-pre-wrap">
                      "{note.content}"
                    </p>
                  </div>
                </motion.div>
              ))
            ) : !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <p className="text-[#A3AED0] font-bold text-lg mb-2">Belum ada catatan. ✍️</p>
                <button onClick={() => setShowAddModal(true)} className="text-[#7B61FF] font-black text-xs uppercase underline">Tulis Sekarang</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FAB untuk HP (Floating Action Button) */}
      <motion.button 
        whileTap={{ scale: 0.8 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-6 w-14 h-14 bg-[#7B61FF] text-white rounded-full text-2xl shadow-2xl flex items-center justify-center z-[60] md:hidden"
      >
        +
      </motion.button>

      {/* MODAL (Tambah & Edit) */}
      <AnimatePresence>
        {(showAddModal || editingNote) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => {setShowAddModal(false); setEditingNote(null)}}
              className="absolute inset-0 bg-[#1B2559]/30 backdrop-blur-sm"
            />
            <motion.form 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onSubmit={editingNote ? handleUpdate : handleAddNote}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative z-10"
            >
              <h3 className="text-xl font-black text-[#1B2559] mb-6 flex items-center gap-2">
                {editingNote ? "📝 Edit Catatan" : "✨ Catatan Baru"}
              </h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={editingNote ? editTitle : newTitle}
                  onChange={(e) => editingNote ? setEditTitle(e.target.value) : setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-[#7B61FF] outline-none font-bold text-[#1B2559]"
                  placeholder="Judul..." required
                />
                <textarea 
                  value={editingNote ? editContent : newContent}
                  onChange={(e) => editingNote ? setEditContent(e.target.value) : setNewContent(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-[#7B61FF] outline-none font-medium text-slate-600 min-h-[180px] md:min-h-[220px]"
                  placeholder="Apa yang Anda pikirkan?" required
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button type="submit" className="bg-[#7B61FF] text-white py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
                  {editingNote ? "Update" : "Simpan"}
                </button>
                <button 
                  type="button" 
                  onClick={() => {setShowAddModal(false); setEditingNote(null)}} 
                  className="bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest active:scale-95 transition-all"
                >
                  Batal
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}