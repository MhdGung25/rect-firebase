export default function Header() {
  return (
    <header className="mb-8 md:mb-10">
      {/* ================= TITLE ================= */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[#1B2559] tracking-tight flex items-center gap-2">
          My Digital Notes <span className="text-lg md:text-2xl">📝</span>
        </h2>

        {/* Accent line (mobile only) */}
        <div className="h-1 w-12 bg-[#7B61FF] rounded-full mt-1 md:hidden" />
      </div>
    </header>
  );
}
