import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // Tambahan: Loading state
  const nav = useNavigate();

  // Memuat email yang tersimpan jika Remember Me aktif
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mulai loading

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Logika simpan email
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      nav("/dashboard");
    } catch (err) {
      // Perbaikan Pesan Error agar lebih mudah dimengerti
      if (err.code === "auth/invalid-credential") {
        alert("Email atau Password salah. Silakan cek kembali atau daftar akun baru.");
      } else if (err.code === "auth/user-not-found") {
        alert("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
      } else {
        alert("Terjadi kesalahan: " + err.message);
      }
    } finally {
      setLoading(false); // Matikan loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative px-4 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px]"></div>

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-sm bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15V17a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4a2 2 0 012 2v2m2 4l2 2m0 0l2-2m-2 2v-4m0 8h11" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Sign In
          </h2>
          <p className="text-slate-400 text-sm mt-2">Enter your digital key</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email || ""} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-500"
            required
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-500"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-3.5 text-slate-500 text-[10px] font-black hover:text-blue-400"
            >
              {showPass ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        {/* Remember Me Toggle */}
        <div className="flex items-center mt-4 ml-1">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500" 
            />
            <span className="text-xs text-slate-400 group-hover:text-slate-200">Remember me</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl font-bold shadow-lg transition-all duration-200 ${
            loading 
            ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
            : "bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {loading ? "Authenticating..." : "Login"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}