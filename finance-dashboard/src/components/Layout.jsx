import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children, activePage, onNavigate }) {
  return (
    <div className="flex min-h-screen bg-[#0f0f12] text-white">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="ml-52 flex-1 p-7">{children}</main>
    </div>
  );
}
