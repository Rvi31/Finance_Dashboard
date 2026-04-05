import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionModal from "./components/TransactionModal";
export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  function openAdd() {
    setEditData(null);
    setModalOpen(true);
  }
  function openEdit(txn) {
    setEditData(txn);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditData(null);
  }

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {activePage === "dashboard" && <Dashboard />}
      {activePage === "transactions" && (
        <Transactions onAdd={openAdd} onEdit={openEdit} />
      )}
      {activePage === "insights" && (
        <div className="text-white">Insights — coming Day 3</div>
      )}

      {modalOpen && (
        <TransactionModal editData={editData} onClose={closeModal} />
      )}
    </Layout>
  );
}
