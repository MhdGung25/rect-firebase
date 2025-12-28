import React from "react";
import { FiHome, FiBarChart2, FiStar, FiSettings } from "react-icons/fi";
import { FaBook } from "react-icons/fa"; // Logo tambahan

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menus = [
    { id: "home", label: "Dashboard", icon: <FiHome /> },
    { id: "favorites", label: "Favorit", icon: <FiStar /> },
    { id: "stats", label: "Statistik", icon: <FiBarChart2 /> },
    { id: "settings", label: "Pengaturan", icon: <FiSettings /> },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 z-50 transition-colors duration-300">
        <div className="flex flex-col h-full w-full">
          {/* BRAND LOGO */}
          <div className="flex items-center gap-2 px-4 mb-10">
            <FaBook className="text-indigo-600 dark:text-indigo-400 text-2xl" />
            <h1 className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              CATATAN<span className="text-slate-800 dark:text-white">KU</span>
            </h1>
          </div>

          {/* NAV MENU */}
          <div className="flex flex-col gap-2">
            {menus.map((menu) => {
              const isActive = activeTab === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveTab(menu.id)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200
                    ${isActive
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                    }
                  `}
                >
                  <span className="text-xl">{menu.icon}</span>
                  {menu.label}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ================= MOBILE/TABLET TOP LOGO ================= */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-center py-2">
        <FaBook className="text-indigo-600 dark:text-indigo-400 text-2xl mr-2" />
        <h1 className="text-lg font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
          CATATAN<span className="text-slate-800 dark:text-white">KU</span>
        </h1>
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <ul className="flex justify-around items-center py-2">
          {menus.map((menu) => {
            const isActive = activeTab === menu.id;
            return (
              <li key={menu.id} className="flex-1">
                <button
                  onClick={() => setActiveTab(menu.id)}
                  className={`
                    w-full flex flex-col items-center gap-1 py-1 transition-all duration-200
                    ${isActive
                      ? "text-indigo-600 dark:text-indigo-400 scale-110"
                      : "text-slate-400 dark:text-slate-500"
                    }
                  `}
                >
                  <span className="text-2xl">{menu.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-tighter">
                    {menu.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
