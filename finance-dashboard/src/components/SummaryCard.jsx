export default function SummaryCard({
  label,
  value,
  change,
  changeDir,
  accentColor,
}) {
  return (
    <div className="bg-[#16161c] border border-[#2e2e3e] rounded-2xl p-5 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: accentColor }}
      />
      <div className="text-[11px] uppercase tracking-widest text-[#5a5a78] mb-2 font-medium">
        {label}
      </div>
      <div className="text-2xl font-semibold font-mono tracking-tight">
        {value}
      </div>
      {change && (
        <div
          className={`inline-flex items-center gap-1 text-[11px] mt-2 px-2 py-0.5 rounded-full font-medium
            ${changeDir === "up" ? "bg-[#0d3d25] text-[#22c97a]" : "bg-[#3d1515] text-[#f05c5c]"}`}
        >
          {changeDir === "up" ? "▲" : "▼"} {change}
        </div>
      )}
    </div>
  );
}
