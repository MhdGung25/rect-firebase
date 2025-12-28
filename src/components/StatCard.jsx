export default function StatCard({ title, value, sub, icon }) {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-50 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-xl">{icon}</div>
        <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-md">{sub}</span>
      </div>
      <p className="text-[#A3AED0] text-[10px] font-bold uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-2xl font-black text-[#1B2559]">{value}</h4>
    </div>
  );
}