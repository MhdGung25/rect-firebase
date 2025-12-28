import React from "react";

const Stats = ({ notes }) => {
  const total = notes.length;
  const favorites = notes.filter(n => n.isFavorite).length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black text-[#1B2559] dark:text-white">📊 Statistik</h3>
        <p className="text-[#A3AED0] dark:text-slate-400">Ringkasan aktivitas catatan Anda.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Total Catatan</p>
          <p className="text-3xl font-black text-[#1B2559] dark:text-white">{total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Favorit</p>
          <p className="text-3xl font-black text-[#7B61FF] dark:text-indigo-400">{favorites}</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
