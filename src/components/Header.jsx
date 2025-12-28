import React from 'react';
import { motion } from 'framer-motion';

export default function Header({ userName }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
      {/* Bagian Judul */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl font-black text-[#1B2559] tracking-tight flex items-center gap-2">
          My Digital Notes <span className="text-lg md:text-2xl">📝</span>
        </h2>
        {/* Jarak tambahan untuk mobile agar tidak terlalu rapat dengan konten bawah */}
        <div className="h-1 w-12 bg-[#7B61FF] rounded-full mt-1 md:hidden"></div>
      </motion.div>
      
      {/* Bagian Identitas User (Avatar) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 bg-white p-1.5 md:p-2 pr-4 md:pr-5 rounded-full shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-default self-end md:self-auto"
      >
        <img 
          src={`https://ui-avatars.com/api/?name=${userName}&background=7B61FF&color=fff&bold=true`} 
          alt="Avatar" 
          className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-slate-50" 
        />
        <div className="flex flex-col">
          <span className="text-[9px] md:text-[10px] text-[#A3AED0] font-black uppercase leading-none mb-1">Owner</span>
          <span className="text-xs md:text-sm font-bold text-[#1B2559] leading-none">{userName}</span>
        </div>
      </motion.div>
    </header>
  );
}