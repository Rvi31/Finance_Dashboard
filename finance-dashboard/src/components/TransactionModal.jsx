import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

const CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Salary",
  "Investment",
  "Other",
];

export default function TransactionModal({ editData, onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    category: "Food",
    type: "expense",
  });

  useEffect(() => {
    if (editData) setForm({ ...editData, amount: String(editData.amount) });
  }, [editData]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSave() {
    if (!form.description.trim() || !form.amount || !form.date) {
      alert("Please fill in all fields");
      return;
    }
    const txn = { ...form, amount: parseFloat(form.amount) };
    if (editData) {
      dispatch({
        type: "EDIT_TRANSACTION",
        payload: { ...txn, id: editData.id },
      });
    } else {
      dispatch({
        type: "ADD_TRANSACTION",
        payload: { ...txn, id: Date.now() },
      });
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#16161c] border border-[#3a3a50] rounded-2xl p-7 w-full max-w-md">
        <h2 className="text-base font-semibold mb-5">
          {editData ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#9090b0] mb-2">
            Description
          </label>
          <input
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="e.g. Grocery run"
            className="w-full bg-[#1e1e28] border border-[#3a3a50] text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#5b8fff] placeholder:text-[#5a5a78]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-[#9090b0] mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#1e1e28] border border-[#3a3a50] text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#5b8fff] placeholder:text-[#5a5a78]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#9090b0] mb-2">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className="w-full bg-[#1e1e28] border border-[#3a3a50] text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:border-[#5b8fff]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="block text-xs font-medium text-[#9090b0] mb-2">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full bg-[#1e1e28] border border-[#3a3a50] text-white text-sm rounded-lg px-4 py-2.5 outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#9090b0] mb-2">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full bg-[#1e1e28] border border-[#3a3a50] text-white text-sm rounded-lg px-4 py-2.5 outline-none cursor-pointer"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-[#2e2e3e] text-[#9090b0] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg bg-[#5b8fff] text-white hover:opacity-85 transition-opacity font-medium"
          >
            {editData ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
