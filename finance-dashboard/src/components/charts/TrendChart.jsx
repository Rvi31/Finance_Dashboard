import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApp } from "../../context/AppContext";

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

function getMonthlyData(transactions) {
  const now = new Date();
  const result = [];
  let running = 0;

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();

    const monthTxns = transactions.filter((t) => {
      const td = new Date(t.date);
      return td.getMonth() === m && td.getFullYear() === y;
    });

    const income = monthTxns
      .filter((t) => t.type === "income")
      .reduce((a, t) => a + t.amount, 0);
    const expense = monthTxns
      .filter((t) => t.type === "expense")
      .reduce((a, t) => a + t.amount, 0);
    running += income - expense;

    result.push({ label: MONTHS[m], balance: running });
  }
  return result;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e28] border border-[#2e2e3e] rounded-xl px-4 py-2 text-sm">
        <p className="text-[#9090b0] mb-1">{label}</p>
        <p className="text-white font-mono font-medium">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

export default function TrendChart() {
  const { state } = useApp();
  const data = getMonthlyData(state.transactions);

  return (
    <div className="bg-[#16161c] border border-[#2e2e3e] rounded-2xl p-6">
      <p className="text-sm font-medium text-white mb-1">Balance Trend</p>
      <p className="text-xs text-[#5a5a78] mb-6">
        Running balance over the past 6 months
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
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
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#5b8fff"
            strokeWidth={2}
            dot={{ fill: "#5b8fff", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
