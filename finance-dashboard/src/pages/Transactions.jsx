import { useState } from "react";
import { useApp } from "../context/AppContext";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const COLORS = {
  Food: "#f5a623",
  Transport: "#5b8fff",
  Housing: "#9b72ff",
  Entertainment: "#f05c5c",
  Healthcare: "#2dd4bf",
  Shopping: "#f472b6",
  Salary: "#22c97a",
  Investment: "#60a5fa",
  Other: "#9090b0",
};
const COLOR_BG = {
  Food: "rgba(245,166,35,.12)",
  Transport: "rgba(91,143,255,.12)",
  Housing: "rgba(155,114,255,.12)",
  Entertainment: "rgba(240,92,92,.12)",
  Healthcare: "rgba(45,212,191,.12)",
  Shopping: "rgba(244,114,182,.12)",
  Salary: "rgba(34,201,122,.12)",
  Investment: "rgba(96,165,250,.12)",
  Other: "rgba(144,144,176,.12)",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
}

export default function Transactions({ onAdd, onEdit }) {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState(-1);

  const isAdmin = state.role === "admin";
  const categories = [
    ...new Set(state.transactions.map((t) => t.category)),
  ].sort();
  const months = [...new Set(state.transactions.map((t) => t.date.slice(0, 7)))]
    .sort()
    .reverse();

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => d * -1);
    else {
      setSortKey(key);
      setSortDir(-1);
    }
  }

  const filtered = state.transactions
    .filter((t) => {
      const q = search.toLowerCase();
      return (
        (!q ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)) &&
        (!typeFilter || t.type === typeFilter) &&
        (!catFilter || t.category === catFilter) &&
        (!monthFilter || t.date.startsWith(monthFilter))
      );
    })
    .sort((a, b) => {
      let av = a[sortKey],
        bv = b[sortKey];
      if (sortKey === "amount") {
        av = +av;
        bv = +bv;
      }
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });

  function SortTh({ label, field }) {
    return (
      <th
        onClick={() => handleSort(field)}
        className="px-4 py-3 text-left text-[11px] font-medium text-[#5a5a78] uppercase tracking-wider cursor-pointer hover:text-[#9090b0] whitespace-nowrap select-none"
      >
        {label} {sortKey === field ? (sortDir === 1 ? "↑" : "↓") : "↕"}
      </th>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-[#9090b0] text-sm mt-1">
            All activity in one place
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportCSV(filtered)}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2e2e3e] bg-[#1e1e28] text-[#9090b0] hover:text-white transition-colors"
          >
            ↓ Export CSV
          </button>
          {isAdmin && (
            <button
              onClick={onAdd}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-[#5b8fff] text-white hover:opacity-85 transition-opacity"
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 bg-[#1e1e28] border border-[#2e2e3e] text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-[#5b8fff] placeholder:text-[#5a5a78]"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#1e1e28] border border-[#2e2e3e] text-sm text-white rounded-lg px-3 py-2 outline-none cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="bg-[#1e1e28] border border-[#2e2e3e] text-sm text-white rounded-lg px-3 py-2 outline-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="bg-[#1e1e28] border border-[#2e2e3e] text-sm text-white rounded-lg px-3 py-2 outline-none cursor-pointer"
        >
          <option value="">All Months</option>
          {months.map((m) => {
            const [y, mo] = m.split("-");
            return (
              <option key={m} value={m}>
                {MONTHS[parseInt(mo) - 1]} {y}
              </option>
            );
          })}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#5a5a78]">
          <div className="text-3xl mb-3">🔍</div>
          <div className="text-sm">No transactions match your filters</div>
        </div>
      ) : (
        <div className="bg-[#16161c] border border-[#2e2e3e] rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#2e2e3e]">
                <SortTh label="Date" field="date" />
                <SortTh label="Description" field="description" />
                <SortTh label="Category" field="category" />
                <SortTh label="Type" field="type" />
                <th
                  className="px-4 py-3 text-right text-[11px] font-medium text-[#5a5a78] uppercase tracking-wider cursor-pointer hover:text-[#9090b0] select-none"
                  onClick={() => handleSort("amount")}
                >
                  Amount{" "}
                  {sortKey === "amount" ? (sortDir === 1 ? "↑" : "↓") : "↕"}
                </th>
                {isAdmin && <th className="px-4 py-3 w-28"></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr
                  key={t.id}
                  className={`border-b border-[#1e1e28] hover:bg-[#1e1e28] transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                >
                  <td className="px-4 py-3 text-xs text-[#9090b0] font-mono whitespace-nowrap">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {t.description}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: COLOR_BG[t.category],
                        color: COLORS[t.category],
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide
                      ${t.type === "income" ? "bg-[#0d3d25] text-[#22c97a]" : "bg-[#3d1515] text-[#f05c5c]"}`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-medium">
                    <span
                      className={
                        t.type === "income"
                          ? "text-[#22c97a]"
                          : "text-[#f05c5c]"
                      }
                    >
                      {t.type === "income" ? "+" : "-"}₹
                      {t.amount.toLocaleString("en-IN")}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onEdit(t)}
                        className="text-xs px-2.5 py-1 rounded border border-[#2e2e3e] text-[#9090b0] hover:text-white mr-2 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "DELETE_TRANSACTION",
                            payload: t.id,
                          })
                        }
                        className="text-xs px-2.5 py-1 rounded bg-[#3d1515] text-[#f05c5c] hover:opacity-80 transition-opacity"
                      >
                        Del
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function exportCSV(transactions) {
  const rows = [["Date", "Description", "Category", "Type", "Amount"]];
  transactions.forEach((t) =>
    rows.push([t.date, t.description, t.category, t.type, t.amount]),
  );
  const csv = rows.map((r) => r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = "fintrack-transactions.csv";
  a.click();
}
