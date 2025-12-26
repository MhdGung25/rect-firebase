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
<nav
  className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all
  ${isDarkMode
    ? "bg-[#050b18]/80 border-white/5"
    : "bg-white/80 border-slate-200 shadow-sm"
  }`}
>
  <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">

    {/* BRAND */}
   <div className="flex items-center gap-2 sm:gap-3">
  <img
    src="/logo.png"
    alt="Digital Notes Logo"
    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain shadow-md"
  />
  <h1 className="text-lg sm:text-2xl font-black tracking-tight">
    DIGITAL
    <span className="text-blue-500">NOTES</span>
  </h1>
</div>


    {/* ACTIONS */}
    <div className="flex items-center gap-4">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90
        ${isDarkMode
          ? "bg-slate-800 text-yellow-400"
          : "bg-white text-slate-600 shadow-md"
        }`}
        title="Toggle theme"
      >
        {isDarkMode ? "✨" : "🌙"}
      </button>

      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500
        text-white text-sm font-bold shadow-lg shadow-red-500/20
        hover:brightness-110 transition-all active:scale-95"
      >
        Logout
      </button>
    </div>

  </div>
</nav>


      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-2">
             Workspace Aktif
          </div>
          <h2 className="text-5xl font-black tracking-tight">
            Hi, <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">{getUserName()}!</span>
          </h2>
          <p className="text-slate-500 font-medium">Jangan biarkan ide hebatmu menguap begitu saja.</p>
        </div>

        {/* Input Form Mewah */}
        <form onSubmit={handleSubmit} className="mb-16 group">
  <div
    className={`p-2 rounded-[2rem] border transition-all duration-500
    ${shake ? "animate-shake border-red-500/50" : ""}
    ${isDarkMode
      ? "bg-slate-900/40 border-white/10 focus-within:border-blue-500/50"
      : "bg-white border-slate-200"
    }`}
  >
    <div className="flex flex-col md:flex-row gap-2">
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
        }}
        placeholder={editId ? "Edit catatanmu..." : "Apa yang kamu pikirkan hari ini?"}
        className={`flex-1 bg-transparent px-6 py-5 text-lg font-medium focus:outline-none
        ${isDarkMode
          ? "text-white placeholder-slate-600"
          : "text-slate-900 placeholder-slate-400"
        }`}
      />

      <button
        type="submit"
        className={`px-10 py-4 rounded-2xl font-bold text-white transition-all active:scale-95
        ${editId
          ? "bg-indigo-600 shadow-indigo-500/30"
          : "bg-blue-600 shadow-blue-500/30"
        }`}
      >
        {editId ? "Update" : "Simpan"}
      </button>
    </div>
  </div>

  {/* ERROR MESSAGE */}
  {error && (
    <p className="mt-3 text-sm text-red-500 animate-in fade-in slide-in-from-top-2">
      ⚠️ {error}
    </p>
  )}
</form>


        {/* Notes Grid */}
        <div className="grid gap-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-[5px] border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 bg-slate-500/5 rounded-[3rem] border border-dashed border-slate-500/20">
              <span className="text-4xl block mb-4">📝</span>
              <p className="text-slate-500 font-medium italic">Belum ada catatan. Mulai menulis sekarang!</p>
            </div>
          ) : (
            notes.map((n, index) => (
              <div 
                key={n.id} 
                style={{ animationDelay: `${index * 100}ms` }}
                className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 ${
                  isDarkMode 
                  ? "bg-slate-900/40 border-white/5 hover:bg-slate-800/60 hover:border-blue-500/30 shadow-xl" 
                  : "bg-white border-slate-100 hover:border-blue-200 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-200/20"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <p className={`text-lg leading-relaxed font-medium whitespace-pre-wrap ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                    {n.text}
                  </p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {new Date(n.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => startEdit(n)} 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${isDarkMode ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteNote(n.id)} 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${isDarkMode ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white" : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"}`}
                        title="Hapus"
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

      {/* MODAL LOGOUT (Glassmorphism) */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/40 animate-in fade-in duration-300">
          <div className={`w-full max-w-sm p-10 rounded-[3rem] shadow-2xl border transition-all scale-in-center ${isDarkMode ? "bg-[#0f172a] border-white/10" : "bg-white border-slate-200"}`}>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🚪</div>
              <h3 className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Siap Berhenti?</h3>
              <p className="text-slate-500 font-medium">Sesi kamu akan diakhiri. Pastikan semua ide sudah tersimpan.</p>
            </div>
            <div className="flex flex-col gap-3 mt-10">
              <button onClick={confirmLogout} className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold shadow-xl shadow-red-500/30 hover:brightness-110 transition-all active:scale-95">Keluar Sekarang</button>
              <button onClick={() => setIsLogoutModalOpen(false)} className="w-full py-4 rounded-2xl bg-slate-500/10 text-slate-400 font-bold hover:bg-slate-500/20 transition-all">Nanti Saja</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}