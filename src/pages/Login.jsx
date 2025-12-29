import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase"; 
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";

const googleProvider = new GoogleAuthProvider();

export default function Login() {
  /* ================= STATE MANAGEMENT ================= */
  // Menggunakan Lazy Initializer agar tidak menyebabkan render ganda
  const [email, setEmail] = useState(() => localStorage.getItem("rememberedEmail") || "");
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem("rememberedEmail"));
  
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ================= INPUT HANDLERS ================= */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(""); 
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(""); 
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async () => {
    if (googleLoading || loading) return;
    setGoogleLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIsSuccess(true);
        setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Login Google dibatalkan atau gagal.");
      setGoogleLoading(false);
    }
  };

  /* ================= EMAIL LOGIN ================= */
  const submit = async (e) => {
    e.preventDefault();
    if (loading || googleLoading) return;
    
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      if (userCredential.user) {
        // Simpan email jika "Ingat Saya" dicentang
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email.trim());
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        setIsSuccess(true);
        setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Email atau password salah.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan. Coba lagi nanti.");
      } else {
        setError("Terjadi kesalahan teknis. Coba lagi.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 transition-all">
        
        {isSuccess ? (
          <div className="py-10 text-center animate-pulse">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle2 size={48} className="text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Berhasil Masuk</h2>
            <p className="text-slate-500 font-medium mt-2">Menuju Dashboard Catatan Digital...</p>
          </div>
        ) : (
          <>
            <div className="text-left mb-8">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">Login</h2>
              <p className="text-[#ecb12a] font-bold mt-1 text-lg italic"> Catatan Digital</p>
              <div className="h-1.5 w-12 bg-[#ecb12a] mt-2 rounded-full"></div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="shrink-0 text-red-500"/>
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-slate-700 border-2 border-slate-200 mb-6 hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {googleLoading ? <Loader2 className="animate-spin" size={20} /> : <FcGoogle className="text-2xl" />}
              Lanjutkan dengan Google
            </button>

            <div className="relative flex items-center justify-center mb-8">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-4 text-[10px] font-black text-slate-400 uppercase absolute tracking-widest">Atau via Email</span>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="group">
                <label className="block text-slate-700 font-black uppercase text-[11px] mb-1.5 ml-1 tracking-wider">Email Kasir</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ecb12a] transition-colors" size={20} />
                  <input
                    type="email"
                    placeholder="nama@warung.com"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#ecb12a] focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-slate-700 font-black uppercase text-[11px] mb-1.5 ml-1 tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ecb12a] transition-colors" size={20} />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#ecb12a] focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ecb12a] transition-colors"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#ecb12a] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                    Ingat Saya
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-4 bg-[#ecb12a] hover:bg-[#d9a021] text-black rounded-2xl font-black tracking-widest transition-all shadow-[0_10px_20px_rgba(236,177,42,0.3)] active:scale-[0.97] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : (
                  <>
                    <LogIn size={20} />
                    MASUK SEKARANG
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm font-medium mb-2">Belum memiliki akun?</p>
              <button
                type="button"
                onClick={() => navigate("/register")} 
                className="text-emerald-600 font-black text-xs hover:text-emerald-700 uppercase tracking-widest transition-colors"
              >
                Daftar Akun Baru
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}