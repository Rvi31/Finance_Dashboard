import { useApp } from "../context/AppContext";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

function getMonthlyComparison(transactions) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const m = d.getMonth(),
      y = d.getFullYear();
    const month = transactions.filter((t) => {
      const td = new Date(t.date);
      return td.getMonth() === m && td.getFullYear() === y;
    });
    return {
      label: MONTHS[m],
      income: month
        .filter((t) => t.type === "income")
        .reduce((a, t) => a + t.amount, 0),
      expense: month
        .filter((t) => t.type === "expense")
        .reduce((a, t) => a + t.amount, 0),
    };
  });
}

function getCategoryTotals(transactions) {
  const byCat = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      byCat[t.category] = (byCat[t.category] || 0) + t.amount;
    });
  return Object.entries(byCat)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);
}

const TooltipStyle = {
  background: "#1e1e28",
  border: "1px solid #2e2e3e",
  borderRadius: "10px",
  fontSize: "12px",
  color: "#fff",
};

function InsightCard({ label, value, sub, color }) {
  return (
    <div className="bg-[#16161c] border border-[#2e2e3e] rounded-2xl p-5">
      <div className="text-[11px] uppercase tracking-widest text-[#5a5a78] mb-2 font-medium">
        {label}
      </div>
      <div
        className="text-xl font-semibold font-mono"
        style={{ color: color || "#fff" }}
      >
        {value}
      </div>
      <div className="text-xs text-[#9090b0] mt-1.5">{sub}</div>
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, t) => a + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);
  const savingsRate =
    income > 0 ? ((1 - expense / income) * 100).toFixed(1) : "0";

  const byCat = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      byCat[t.category] = (byCat[t.category] || 0) + t.amount;
    });
  const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

  const monthly = getMonthlyComparison(transactions);
  const curMonth = monthly[monthly.length - 1];
  const lastMonth = monthly[monthly.length - 2];
  const expenseChange =
    lastMonth?.expense > 0
      ? (
          ((curMonth.expense - lastMonth.expense) / lastMonth.expense) *
          100
        ).toFixed(1)
      : null;

  const avgMonthlyExpense = Math.round(expense / 6);
  const catTotals = getCategoryTotals(transactions);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold">Insights</h1>
        <p className="text-[#9090b0] text-sm mt-1">
          Understand your money habits
        </p>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <InsightCard
          label="Top Spending Category"
          value={topCat ? topCat[0] : "N/A"}
          sub={
            topCat
              ? "₹" + topCat[1].toLocaleString("en-IN") + " total spent"
              : ""
          }
          color={topCat ? COLORS[topCat[0]] : "#fff"}
        />
        <InsightCard
          label="Overall Savings Rate"
          value={savingsRate + "%"}
          sub={
            parseFloat(savingsRate) > 30
              ? "Excellent! Keep it up"
              : parseFloat(savingsRate) > 15
                ? "Good saving habits"
                : "Try to save more"
          }
          color={parseFloat(savingsRate) > 20 ? "#22c97a" : "#f05c5c"}
        />
        <InsightCard
          label="vs Last Month (Expense)"
          value={expenseChange !== null ? expenseChange + "%" : "N/A"}
          sub={
            expenseChange !== null
              ? parseFloat(expenseChange) > 0
                ? "↑ Higher than last month"
                : "↓ Lower than last month"
              : "Not enough data"
          }
          color={
            expenseChange && parseFloat(expenseChange) > 0
              ? "#f05c5c"
              : "#22c97a"
          }
        />
        <InsightCard
          label="Avg Monthly Expense"
          value={"₹" + avgMonthlyExpense.toLocaleString("en-IN")}
          sub="Based on last 6 months"
        />
        <InsightCard
          label="This Month Savings"
          value={
            "₹" +
            Math.abs(curMonth.income - curMonth.expense).toLocaleString("en-IN")
          }
          sub={
            curMonth.income - curMonth.expense >= 0
              ? "Positive balance"
              : "Spending exceeded income"
          }
          color={
            curMonth.income - curMonth.expense >= 0 ? "#22c97a" : "#f05c5c"
          }
        />
        <InsightCard
          label="Total Transactions"
          value={transactions.length}
          sub={
            transactions.filter((t) => t.type === "income").length +
            " income · " +
            transactions.filter((t) => t.type === "expense").length +
            " expense"
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly bar chart */}
        <div className="bg-[#16161c] border border-[#2e2e3e] rounded-2xl p-6">
          <p className="text-sm font-medium text-white mb-1">
            Monthly Income vs Expenses
          </p>
          <p className="text-xs text-[#5a5a78] mb-6">6-month comparison</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly} barCategoryGap="30%">
              <CartesianGrid stroke="#1e1e28" strokeDasharray="0" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#5a5a78", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#5a5a78", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"}
              />
              <Tooltip
                formatter={(v) => "₹" + v.toLocaleString("en-IN")}
                contentStyle={TooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#9090b0" }} />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c97a"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#f05c5c"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Horizontal bar — top categories */}
        <div className="bg-[#16161c] border border-[#2e2e3e] rounded-2xl p-6">
          <p className="text-sm font-medium text-white mb-1">
            Top Spending Categories
          </p>
          <p className="text-xs text-[#5a5a78] mb-6">All-time breakdown</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={catTotals} layout="vertical" barCategoryGap="25%">
              <CartesianGrid
                stroke="#1e1e28"
                strokeDasharray="0"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#5a5a78", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#9090b0", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                formatter={(v) => [
                  "₹" + v.toLocaleString("en-IN"),
                  "Total Spent",
                ]}
                contentStyle={TooltipStyle}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                fill="#5b8fff"
                shape={(props) => {
                  const { x, y, width, height, name } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={COLORS[name] || "#9090b0"}
                      rx={4}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
