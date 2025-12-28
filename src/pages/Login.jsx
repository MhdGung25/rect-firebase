import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      nav("/dashboard");
    } catch (err) {
      alert("Gagal login dengan Google: " + err.message);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      nav("/dashboard");
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        alert("Email atau Password salah.");
      } else {
        alert("Terjadi kesalahan: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf2da] p-4 md:p-10 font-sans">
      {/* Container Utama */}
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-in fade-in zoom-in duration-700">
        
        {/* SISI KIRI: Tema Catatan Digital */}
        <div className="hidden md:flex md:w-1/2 bg-[#f8b533] relative p-12 flex-col justify-between overflow-hidden">
          {/* Dekorasi Background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg viewBox="0 0 500 500" className="w-full h-full">
              <path d="M0,100 C150,200 350,0 500,100 L500,500 L0,500 Z" fill="white" />
            </svg>
          </div>

          <div className="relative z-10">
            <h1 className="text-white text-4xl font-black italic tracking-tighter italic">NoteFlow</h1>
          </div>

          <div className="relative z-10 flex flex-col items-center">
             {/* Ikon Catatan */}
             <div className="text-[12rem] animate-bounce duration-[3000ms] mb-8">📝</div>
             <div className="text-center text-white space-y-2 px-6">
                <h3 className="text-2xl font-bold">Ide Anda, Terorganisir.</h3>
                <p className="text-white/80 text-sm">Simpan pemikiran, rencana, dan catatan harian Anda dalam satu tempat yang aman.</p>
             </div>
          </div>

          <div className="relative z-10 text-white/50 text-xs font-medium uppercase tracking-widest">
              © 2025 NoteFlow Digital System.
          </div>
        </div>

        {/* SISI KANAN: Form Login */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center md:text-left mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-[#f8b533] italic mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-slate-400 font-medium">Lanjutkan produktivitas Anda hari ini.</p>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 border-2 border-slate-100 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 mb-6"
            >
              <FcGoogle className="text-xl" />
              Log in with Google
            </button>

            <div className="relative flex items-center py-2 mb-6">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-black uppercase tracking-widest">Or login with account</span>
              <div className="flex-grow border-t border-slate-100"></div>
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
                  <span className="text-slate-400">🔒</span>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
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

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-lg accent-[#f8b533]" 
                  />
                  <span className="text-xs font-bold text-slate-500">Ingat Saya</span>
                </label>
                <button type="button" className="text-xs font-bold text-[#f8b533] hover:underline">Lupa Password?</button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-white uppercase tracking-widest text-sm shadow-xl transition-all ${
                  loading 
                  ? "bg-slate-300 cursor-not-allowed" 
                  : "bg-[#f8b533] hover:bg-[#e2a42b] active:scale-95 shadow-[#f8b533]/20"
                }`}
              >
                {loading ? "Mencocokkan Data..." : "Masuk Sekarang"}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm font-medium">
                Belum punya akun?{" "}
                <Link to="/register" className="text-[#f8b533] font-black hover:underline transition-all">
                  Daftar Disini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}