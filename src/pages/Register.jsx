import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    
    // Validasi Konfirmasi Sandi
    if (password !== confirmPassword) {
      return alert("Password dan Konfirmasi Password tidak cocok!");
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Tampilkan pesan sukses
      alert("Registrasi Berhasil! Silakan login dengan akun baru Anda.");
      
      // DIUBAH: Arahkan ke halaman Login ("/") bukannya Dashboard
      nav("/"); 
      
    } catch (err) {
      alert("Gagal Daftar: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4">
      
      {/* Ornamen Cahaya Neon */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]"></div>

      {/* Card Register */}
      <form
        onSubmit={submit}
        className="w-full max-w-md backdrop-blur-2xl bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-2xl z-10 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-tight">
            New Account
          </h2>
          <p className="text-slate-400 mt-2 text-xs uppercase tracking-[0.2em] font-bold">
            Start your journey
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-slate-900/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-slate-500"
            required
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-900/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-slate-500"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-4 text-slate-500 text-xs font-bold hover:text-purple-400"
            >
              {showPass ? "HIDE" : "SHOW"}
            </button>
          </div>

          <input
            type={showPass ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-slate-900/50 text-white border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-slate-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg shadow-[0_10px_30px_-10px_rgba(147,51,234,0.5)] transform hover:-translate-y-1 transition-all active:scale-95"
        >
          Create Account
        </button>

        <div className="text-center pt-2">
          <p className="text-slate-400 text-sm">
            Already a member?{" "}
            <Link 
              to="/" 
              className="text-purple-400 font-bold hover:text-purple-300 transition-colors underline-offset-4 hover:underline"
            >
              Sign In Here
            </Link>
          </p>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-2">
          <p className="text-slate-500 text-[9px] font-mono tracking-widest uppercase italic">
            Secure Digital Protocol • Firebase V10
          </p>
        </div>
      </form>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
    </div>
  );
}