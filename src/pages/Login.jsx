import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

/* ✅ Provider dibuat SEKALI di luar component */
const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const nav = useNavigate();

  /* ================= REMEMBER EMAIL ================= */
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /* ================= GOOGLE LOGIN (FIXED) ================= */
  const handleGoogleLogin = async () => {
    if (googleLoading) return;

    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        nav("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(err.code);
      if (err.code !== "auth/cancelled-popup-request") {
        alert("Gagal login Google: " + err.message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  /* ================= EMAIL LOGIN ================= */
  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      if (userCredential.user) {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        nav("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(err.code);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        alert("Email atau password salah.");
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] dark:bg-slate-950 p-4 transition-colors">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* ================= LEFT BRAND ================= */}
        <div className="hidden md:flex md:w-1/2 bg-indigo-600 p-12 flex-col justify-between">
          <h1 className="text-white text-3xl font-black">
            CATATAN<span className="opacity-70">KU</span>
          </h1>

          <div className="text-center">
            <div className="text-[8rem] mb-4">📝</div>
            <h3 className="text-xl font-black text-white">
              Ide Digital, Aman.
            </h3>
            <p className="text-indigo-100 text-sm mt-2">
              Semua catatanmu, satu tempat modern.
            </p>
          </div>

          <span className="text-indigo-200 text-xs">
            © 2025 CatatanKu
          </span>
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="flex-1 p-8 md:p-16 flex items-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
              Masuk untuk melanjutkan.
            </p>

            {/* GOOGLE BUTTON */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold mb-6 transition-all
                ${
                  googleLoading
                    ? "bg-slate-200 cursor-not-allowed"
                    : "border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                }`}
            >
              <FcGoogle className="text-xl" />
              {googleLoading ? "Memproses..." : "Sign in with Google"}
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs text-slate-400 font-bold">EMAIL</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

            <form onSubmit={submit} className="space-y-4">
              {/* EMAIL */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 rounded-2xl">
                <FiMail />
                <input
                  type="email"
                  placeholder="email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 bg-transparent outline-none font-bold"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 rounded-2xl">
                <FiLock />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 bg-transparent outline-none font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* REMEMBER */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Ingat saya
              </label>

             <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-white transition-all ${
                loading
                  ? "bg-slate-400"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
              }`}
            >
              {loading ? "MEMPROSES..." : "MASUK"}
            </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Belum punya akun?{" "}
              <Link to="/register" className="text-indigo-600 font-bold">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
