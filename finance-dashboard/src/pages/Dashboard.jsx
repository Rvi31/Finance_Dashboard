import { useApp } from "../context/AppContext";
import SummaryCard from "../components/SummaryCard";
import TrendChart from "../components/charts/TrendChart";
import DonutChart from "../components/charts/DonutChart";

function formatINR(n) {
  return "₹" + Math.abs(n).toLocaleString("en-IN");
}

export default function Dashboard({ onAdd }) {
  const { state } = useApp();
  const { transactions } = state;

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;
  const savingsRate =
    income > 0 ? ((1 - expense / income) * 100).toFixed(1) : "0";

  const now = new Date();
  const thisMonthExpense = transactions
    .filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === "expense" &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold">Overview</h1>
          <p className="text-[#9090b0] text-sm mt-1">Your financial snapshot</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-[#5a5a78] bg-[#1e1e28] border border-[#2e2e3e] px-3 py-2 rounded-lg">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          {state.role === "admin" && (
            <button
              onClick={onAdd}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-[#5b8fff] text-white hover:opacity-85 transition-opacity"
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Balance"
          value={formatINR(balance)}
          change={
            income > 0
              ? ((balance / income) * 100).toFixed(1) + "% of income"
              : null
          }
          changeDir="up"
          accentColor="#5b8fff"
        />
        <SummaryCard
          label="Total Income"
          value={formatINR(income)}
          change={null}
          accentColor="#22c97a"
        />
        <SummaryCard
          label="Total Expenses"
          value={formatINR(expense)}
          change={"This month: " + formatINR(thisMonthExpense)}
          changeDir="down"
          accentColor="#f05c5c"
        />
        <SummaryCard
          label="Savings Rate"
          value={savingsRate + "%"}
          change={
            parseFloat(savingsRate) > 20
              ? "Healthy savings"
              : "Try to save more"
          }
          changeDir={parseFloat(savingsRate) > 20 ? "up" : "down"}
          accentColor="#9b72ff"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <div>
          <DonutChart />
        </div>
      </div>
    </div>
  );
}
