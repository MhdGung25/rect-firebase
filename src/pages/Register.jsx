import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Password dan Konfirmasi Password tidak cocok!");
    }

    if (password.length < 6) {
      return alert("Password minimal harus 6 karakter!");
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Akun NoteFlow berhasil dibuat! Silakan login.");
      nav("/");
    } catch (err) {
      alert("Gagal daftar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf2da] p-4 md:p-10 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-in fade-in zoom-in duration-700">

        {/* SISI KIRI: Tema Catatan Digital */}
        <div className="hidden md:flex md:w-1/2 bg-[#f8b533] relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg viewBox="0 0 500 500" className="w-full h-full">
              <path d="M0,100 C150,200 350,0 500,100 L500,500 L0,500 Z" fill="white" />
            </svg>
          </div>

          <div className="relative z-10">
            <h1 className="text-white text-4xl font-black italic tracking-tighter">
              NoteFlow
            </h1>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="text-[12rem] animate-bounce duration-[3000ms] mb-8">
              ✍️
            </div>
            <div className="text-center text-white space-y-2 px-6">
              <h3 className="text-2xl font-bold">Mulai Perjalananmu</h3>
              <p className="text-white/80 text-sm">
                Bergabunglah dengan ribuan orang yang sudah mendigitalkan catatan mereka.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-white/50 text-xs font-medium uppercase tracking-widest">
            © 2025 NoteFlow Digital System.
          </div>
        </div>

        {/* SISI KANAN: Form Input */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center md:text-left mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-[#f8b533] italic mb-2 tracking-tight">
                Create Account
              </h2>
              <p className="text-slate-400 font-medium">
                Daftarkan diri Anda untuk mulai mencatat.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              {/* Input Email */}
              <div className="group">
                <div className="flex items-center bg-slate-50 border-2 border-transparent group-focus-within:border-[#f8b533]/30 group-focus-within:bg-white rounded-2xl px-4 py-1 transition-all">
                  <span className="text-slate-400">📧</span>
                  <input
                    type="email"
                    placeholder="Alamat Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-transparent outline-none font-semibold text-slate-700 placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="group">
                <div className="flex items-center bg-slate-50 border-2 border-transparent group-focus-within:border-[#f8b533]/30 group-focus-within:bg-white rounded-2xl px-4 py-1 transition-all relative">
                  <span className="text-slate-400">🔑</span>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password Baru"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-transparent outline-none font-semibold text-slate-700 placeholder-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[10px] font-black text-slate-400 hover:text-[#f8b533] pr-2"
                  >
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {/* Input Konfirmasi Password */}
              <div className="group">
                <div className="flex items-center bg-slate-50 border-2 border-transparent group-focus-within:border-[#f8b533]/30 group-focus-within:bg-white rounded-2xl px-4 py-1 transition-all">
                  <span className="text-slate-400">🔒</span>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 bg-transparent outline-none font-semibold text-slate-700 placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Tombol Daftar */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-white uppercase tracking-widest text-sm shadow-xl transition-all ${
                  loading
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-[#f8b533] hover:bg-[#e2a42b] active:scale-95 shadow-[#f8b533]/20"
                }`}
              >
                {loading ? "Mendaftarkan Akun..." : "Daftar Sekarang"}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm font-medium">
                Sudah punya akun?{" "}
                <Link
                  to="/"
                  className="text-[#f8b533] font-black hover:underline transition-all"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}