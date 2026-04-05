import Sidebar from "./Sidebar";

export default function Layout({ children, activePage, onNavigate }) {
  return (
    <div className="flex min-h-screen bg-[#0f0f12] text-white">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#16161c] border-t border-[#2e2e3e] flex z-10">
        {[
          { id: "dashboard", icon: "⬡", label: "Overview" },
          { id: "transactions", icon: "⊞", label: "Transactions" },
          { id: "insights", icon: "◎", label: "Insights" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-[10px] transition-colors
              ${activePage === item.id ? "text-[#5b8fff]" : "text-[#5a5a78]"}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <main className="md:ml-52 flex-1 p-4 md:p-7 pb-24 md:pb-7">
        {children}
      </main>
    </div>
  );
}
