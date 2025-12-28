import React from 'react';

export default function Favorites({ notes, loading }) {
  // Filter catatan yang hanya memiliki isFavorite true
  const favNotes = notes.filter(note => note.isFavorite);

  return (
    <div className="pb-20">
      {/* Judul Halaman & Badge */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl md:text-2xl font-black text-[#1B2559] flex items-center gap-2">
            <span className="p-2 bg-yellow-400 rounded-xl shadow-sm text-white text-base">⭐</span> 
            Catatan Favorit
          </h3>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
            {favNotes.length} Tersemat
          </span>
        </div>
      </div>

      {/* Grid Catatan Favorit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {loading ? (
          // Loading State
          <div className="col-span-full text-center py-20">
            <p className="text-slate-400 font-medium italic animate-pulse">Memuat favorit...</p>
          </div>
        ) : favNotes.length > 0 ? (
          favNotes.map((note) => (
            <div 
              key={note.id} 
              className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-yellow-50 hover:border-yellow-200 transition-all relative overflow-hidden group hover:shadow-xl hover:shadow-yellow-100/30"
            >
              {/* Ikon Bintang Pojok */}
              <div className="absolute top-0 right-0 p-4">
                <span className="text-yellow-400 text-xl">⭐</span>
              </div>

              <h4 className="text-[#1B2559] font-bold text-lg mb-3 pr-8 line-clamp-1">
                {note.title}
              </h4>
              <p className="text-[#A3AED0] text-sm line-clamp-4 leading-relaxed italic whitespace-pre-wrap">
                "{note.content}"
              </p>

              <div className="mt-5 pt-4 border-t border-slate-50 flex flex-col">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                  Dibuat pada
                </span>
                <span className="text-[10px] font-bold text-[#7B61FF]">
                  {note.createdAt ? note.createdAt.toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  }) : '...'}
                </span>
              </div>
            </div>
          ))
        ) : (
          // Empty State
          <div className="col-span-full text-center py-20 md:py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-[#1B2559] font-black text-lg italic">Belum ada catatan favorit.</p>
            <p className="text-[#A3AED0] text-sm mt-1 px-6">
              Klik ikon bintang pada catatanmu agar muncul di sini!
            </p>
          </div>
        )}
      </div>

      {/* Footer info */}
      <p className="mt-12 text-center text-[#A3AED0] text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
        Digital Notes Favorites Gallery
      </p>
    </div>
  );
}