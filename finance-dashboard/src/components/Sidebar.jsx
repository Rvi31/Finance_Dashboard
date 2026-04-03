const navItems = [
  { id: "dashboard", label: "Overview", icon: "⬡" },
  { id: "transactions", label: "Transactions", icon: "⊞" },
  { id: "insights", label: "Insights", icon: "◎" },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-52 bg-[#16161c] border-r border-[#2e2e3e] flex flex-col z-10">
      <div className="px-5 py-6 border-b border-[#2e2e3e]">
        <div className="font-mono text-lg font-medium text-white tracking-tight">
          ◈ fintrack
        </div>
        <div className="text-xs text-[#5a5a78] mt-1">personal finance</div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-2
              ${
                activePage === item.id
                  ? "text-white bg-[#1e1e28] border-[#5b8fff]"
                  : "text-[#9090b0] border-transparent hover:text-white hover:bg-[#1e1e28]"
              }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2e2e3e]">
        <div className="text-[10px] uppercase tracking-widest text-[#5a5a78] mb-2">
          Role
        </div>
        <select className="w-full bg-[#1e1e28] border border-[#2e2e3e] text-white text-xs rounded-lg px-3 py-2 cursor-pointer outline-none">
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
    </aside>
  );
}
