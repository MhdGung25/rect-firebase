import { FiLogOut, FiUser, FiMoon, FiSun } from "react-icons/fi";
import useDarkMode from "../hooks/useDarkMode";

export default function Settings({ user, onLogout }) {
  const [darkMode, setDarkMode] = useDarkMode();

  const getUserName = () => user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 pt-4">
      {/* HEADER */}
      <div className="mb-2">
        <h2 className="text-2xl font-black text-[#1B2559] dark:text-white flex items-center gap-2">
          <span className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">⚙️</span> Pengaturan
        </h2>
      </div>

      {/* CARD PROFIL */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-700 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center text-3xl mb-4">
          <FiUser />
        </div>
        <h3 className="text-xl font-black text-[#1B2559] dark:text-white uppercase tracking-tight">
          {getUserName()}
        </h3>
        <p className="text-[#A3AED0] text-sm font-medium">{user?.email}</p>
      </div>

      {/* CARD KONFIGURASI */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-700 space-y-8">
        
        {/* FITUR DARK MODE */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">Tampilan Aplikasi</h4>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex justify-between items-center group transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-indigo-500">
                {darkMode ? <FiMoon /> : <FiSun />}
              </div>
              <span className="font-bold text-[#1B2559] dark:text-white">
                Mode {darkMode ? 'Gelap' : 'Terang'}
              </span>
            </div>
            {/* Toggle Switch UI */}
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-indigo-500' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>

        {/* LOGOUT */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={onLogout} 
            className="w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <FiLogOut /> Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  );
}