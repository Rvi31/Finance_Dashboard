import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {activePage === "dashboard" && <Dashboard />}
      {activePage === "transactions" && (
        <div className="text-white">Transactions — coming Day 2</div>
      )}
      {activePage === "insights" && (
        <div className="text-white">Insights — coming Day 3</div>
      )}
    </Layout>
  );
}
