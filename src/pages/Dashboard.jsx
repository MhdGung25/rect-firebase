import { collection, addDoc, onSnapshot, query, where, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null); // Untuk tracking catatan yang diedit
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);


  const getUserName = () => {
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.email) return currentUser.email.split("@")[0];
    return "User";
  };

  useEffect(() => {
    const authUnsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const q = query(
          collection(db, "notes"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapUnsub = onSnapshot(q, (snapshot) => {
          const notesData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setNotes(notesData);
          setLoading(false);
        }, (error) => {
          console.error("Firestore Error:", error);
          setLoading(false);
        });

        return () => snapUnsub();
      } else {
        nav("/");
      }
    });
    return () => authUnsub();
  }, [nav]);

  // Fungsi Tambah & Edit Catatan
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!text.trim()) {
    setError("Catatan tidak boleh kosong");
    setShake(true);

    setTimeout(() => setShake(false), 400);
    return;
  }

  if (!currentUser) return;

  try {
    if (editId) {
      await updateDoc(doc(db, "notes", editId), {
        text: text.trim(),
        updatedAt: Date.now(),
      });
      setEditId(null);
    } else {
      await addDoc(collection(db, "notes"), {
        uid: currentUser.uid,
        text: text.trim(),
        createdAt: Date.now(),
      });
    }

    setText("");
    setError("");
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan");
  }
};


  const startEdit = (note) => {
    setEditId(note.id);
    setText(note.text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteNote = async (noteId) => {
  if (window.confirm("Hapus catatan ini selamanya?")) {
    try {
      await deleteDoc(doc(db, "notes", noteId));
    } catch (err) {
      console.error("Gagal menghapus catatan:", err);
      alert("Gagal menghapus catatan");
    }
  }
};


  const confirmLogout = async () => {
    await signOut(auth);
    nav("/");
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDarkMode ? "bg-[#050b18] text-slate-200" : "bg-[#f8fafc] text-slate-900"}`}>
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${isDarkMode ? "bg-blue-600" : "bg-blue-300"}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${isDarkMode ? "bg-purple-600" : "bg-purple-300"}`}></div>
      </div>

      {/* Navbar Modern */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all ${isDarkMode ? "bg-[#050b18]/80 border-white/5" : "bg-white/80 border-slate-200 shadow-sm"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* BRAND */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
            <h1 className="text-sm sm:text-xl font-black tracking-tight uppercase">
              Digital <span className="text-blue-500">Notes</span>
            </h1>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 ${isDarkMode ? "bg-slate-800 text-yellow-400" : "bg-white text-slate-600 shadow-sm border border-slate-100"}`}
            >
              {isDarkMode ? "✨" : "🌙"}
            </button>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-500/20 active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
              Workspace Aktif
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight break-words">
            Hi, <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">{getUserName()}!</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-medium">Jangan biarkan ide hebatmu menguap begitu saja.</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-10 sm:mb-16">
          <div className={`p-2 rounded-2xl sm:rounded-[2rem] border transition-all duration-500 ${shake ? "animate-shake border-red-500/50" : ""} ${isDarkMode ? "bg-slate-900/40 border-white/10 focus-within:border-blue-500/50" : "bg-white border-slate-200 shadow-sm"}`}>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={text}
                onChange={(e) => { setText(e.target.value); setError(""); }}
                placeholder={editId ? "Edit catatan..." : "Apa yang kamu pikirkan?"}
                className={`flex-1 bg-transparent px-4 py-4 sm:px-6 sm:py-5 text-base sm:text-lg font-medium focus:outline-none ${isDarkMode ? "text-white placeholder-slate-600" : "text-slate-900 placeholder-slate-400"}`}
              />
              <button
                type="submit"
                className={`w-full sm:w-auto px-8 py-4 rounded-xl sm:rounded-2xl font-bold text-white transition-all active:scale-95 ${editId ? "bg-indigo-600" : "bg-blue-600"}`}
              >
                {editId ? "Update" : "Simpan"}
              </button>
            </div>
          </div>
          {error && <p className="mt-3 text-xs sm:text-sm text-red-500">⚠️ {error}</p>}
        </form>

        {/* Notes Grid */}
        <div className="grid gap-4 sm:gap-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16 bg-slate-500/5 rounded-3xl border border-dashed border-slate-500/20">
              <span className="text-3xl block mb-2">📝</span>
              <p className="text-slate-500 text-sm italic">Belum ada catatan.</p>
            </div>
          ) : (
            notes.map((n) => (
              <div 
                key={n.id} 
                className={`group relative p-5 sm:p-8 rounded-3xl border transition-all duration-300 ${isDarkMode ? "bg-slate-900/40 border-white/5 shadow-xl" : "bg-white border-slate-100 shadow-md"}`}
              >
                <div className="flex flex-col gap-4">
                  {/* Teks Catatan dengan word-break */}
                  <p className={`text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap break-words overflow-hidden ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                    {n.text}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {new Date(n.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>

                    {/* Button Container: Selalu muncul di Mobile, Hover di Desktop */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(n)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600 border border-blue-100"}`}
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteNote(n.id)} 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${isDarkMode ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600 border border-red-100"}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
          <div className={`w-full max-w-sm p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border ${isDarkMode ? "bg-[#0f172a] border-white/10" : "bg-white border-slate-200"}`}>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🚪</div>
              <h3 className={`text-xl sm:text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Siap Berhenti?</h3>
              <p className="text-sm text-slate-500">Sesi kamu akan diakhiri sekarang.</p>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <button onClick={confirmLogout} className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/20 active:scale-95">Keluar Sekarang</button>
              <button onClick={() => setIsLogoutModalOpen(false)} className="w-full py-4 rounded-2xl bg-slate-500/10 text-slate-400 font-bold active:scale-95">Nanti Saja</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}