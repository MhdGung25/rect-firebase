import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, addDoc, serverTimestamp, 
  doc, deleteDoc, updateDoc 
} from 'firebase/firestore';
import { FiPlus, FiStar, FiEdit3, FiTrash2, FiCalendar } from "react-icons/fi";

export default function Notes({ notes, loading }) {
  // State untuk Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Fungsi Tambah Catatan
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

  // Fungsi Hapus Catatan
  const handleDelete = async (id) => {
    if (window.confirm("Hapus catatan ini selamanya?")) {
      try {
        await deleteDoc(doc(db, "notes", id));
      } catch (err) {
        alert("Gagal menghapus: " + err.message);
      }
    }
  };

  // Fungsi Update Catatan
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

  // Fungsi Favorit
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

  return (
    <div className="pb-20">
      {/* Tombol Tambah Desktop */}
      <div className="mb-8 flex justify-between items-center">
        <h3 className="text-xl md:text-2xl font-black text-[#1B2559] flex items-center gap-3">
          📚 Semua Catatan
          <span className="bg-[#7B61FF]/10 text-[#7B61FF] px-3 py-1 rounded-full text-[10px] font-black uppercase">
            {notes.length} Total
          </span>
        </h3>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="hidden md:flex items-center gap-2 bg-[#7B61FF] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-purple-200 hover:brightness-110 active:scale-95 transition-all"
        >
          <FiPlus /> Tambah Catatan
        </button>
      </div>

      {/* Grid Catatan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div 
              key={note.id} 
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">
                    <FiCalendar />
                    {note.createdAt ? note.createdAt.toLocaleDateString('id-ID') : 'Baru saja'}
                  </span>
                  <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleFavorite(note)} className={`p-2 rounded-xl transition-colors ${note.isFavorite ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:bg-slate-100'}`}>
                      <FiStar className={note.isFavorite ? "fill-current" : ""} />
                    </button>
                    <button onClick={() => startEdit(note)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors">
                      <FiEdit3 />
                    </button>
                    <button onClick={() => handleDelete(note.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <h4 className="text-[#1B2559] font-bold text-lg mb-2 line-clamp-1">{note.title}</h4>
                <p className="text-[#A3AED0] text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            </div>
          ))
        ) : !loading && (
          <div className="col-span-full text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="text-4xl mb-4">✍️</div>
            <p className="text-[#A3AED0] font-bold text-lg mb-2">Belum ada catatan.</p>
            <button onClick={() => setShowAddModal(true)} className="text-[#7B61FF] font-black text-xs uppercase underline tracking-widest">Mulai Menulis</button>
          </div>
        )}
      </div>

      {/* Floating Action Button untuk Mobile */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-[#7B61FF] text-white rounded-2xl text-2xl shadow-2xl flex items-center justify-center z-[40] md:hidden active:scale-90 transition-transform"
      >
        <FiPlus />
      </button>

      {/* MODAL (Tambah & Edit) - Menggunakan CSS murni untuk overlay */}
      {(showAddModal || editingNote) && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#1B2559]/40 backdrop-blur-md"
            onClick={() => {setShowAddModal(false); setEditingNote(null)}}
          />
          
          {/* Form Modal */}
          <form 
            onSubmit={editingNote ? handleUpdate : handleAddNote}
            className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative z-10 border border-white animate-in fade-in zoom-in duration-200"
          >
            <h3 className="text-xl font-black text-[#1B2559] mb-6">
              {editingNote ? "✏️ Edit Catatan" : "✨ Catatan Baru"}
            </h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={editingNote ? editTitle : newTitle}
                onChange={(e) => editingNote ? setEditTitle(e.target.value) : setNewTitle(e.target.value)}
                className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-[#7B61FF] outline-none font-bold text-[#1B2559] transition-all"
                placeholder="Judul Catatan..." required
              />
              <textarea 
                value={editingNote ? editContent : newContent}
                onChange={(e) => editingNote ? setEditContent(e.target.value) : setNewContent(e.target.value)}
                className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-[#7B61FF] outline-none font-medium text-slate-600 min-h-[200px] transition-all"
                placeholder="Tuliskan isi catatan di sini..." required
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button type="submit" className="bg-[#7B61FF] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">
                {editingNote ? "Perbarui" : "Simpan"}
              </button>
              <button 
                type="button" 
                onClick={() => {setShowAddModal(false); setEditingNote(null)}} 
                className="bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}