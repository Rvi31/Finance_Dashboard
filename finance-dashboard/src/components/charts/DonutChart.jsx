import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../../context/AppContext";

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

export default function DonutChart() {
  const { state } = useApp();
  const now = new Date();

  const expenses = state.transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      t.type === "expense" &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const byCat = {};
  expenses.forEach((t) => {
    byCat[t.category] = (byCat[t.category] || 0) + t.amount;
  });
  const data = Object.entries(byCat)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const total = data.reduce((a, d) => a + d.value, 0);

  return (
    <div className="bg-[#16161c] border border-[#2e2e3e] rounded-2xl p-6 h-full">
      <p className="text-sm font-medium text-white mb-1">
        Spending by Category
      </p>
      <p className="text-xs text-[#5a5a78] mb-4">Current month breakdown</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-[#5a5a78] text-sm">
          No expenses this month
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || "#888"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  "₹" + value.toLocaleString("en-IN"),
                  name,
                ]}
                contentStyle={{
                  background: "#1e1e28",
                  border: "1px solid #2e2e3e",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-2 mt-2">
            {data.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-sm flex-shrink-0"
                    style={{ background: COLORS[d.name] || "#888" }}
                  />
                  <span className="text-[#9090b0]">{d.name}</span>
                </div>
                <span className="text-white font-mono">
                  {total > 0 ? Math.round((d.value / total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
