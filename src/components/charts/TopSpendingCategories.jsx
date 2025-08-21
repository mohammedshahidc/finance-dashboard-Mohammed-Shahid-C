import React, { useContext, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign } from "lucide-react";
import dayjs from "dayjs";
import { TransactionContext } from "../../context/TransactionContext";

const TopSpendingCategories = ({ isDark, currency = "$" }) => {
  const { transactions } = useContext(TransactionContext);

  const topCategories = useMemo(() => {
    const now = dayjs();
    const currentMonth = now.month(); // 0-11
    const currentYear = now.year();

    const monthlyExpenses = transactions.filter((t) => {
      const d = dayjs(t.date);
      return (
        t.type === "expense" &&
        d.month() === currentMonth &&
        d.year() === currentYear
      );
    });

    const categoryTotals = monthlyExpenses.reduce((acc, t) => {
      const category = t.category || "Other";
      acc[category] = (acc[category] || 0) + parseFloat(t.amount || 0);
      return acc;
    }, {});

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // Different color sets for light and dark modes
  const lightColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];
  const darkColors = ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa"];
  
  const colors = isDark ? darkColors : lightColors;

  const formatCurrency = (value) => {
    return `${currency}${value.toFixed(2)}`;
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-md transition-colors ${
        isDark 
          ? "bg-black" 
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <DollarSign 
          className={isDark ? "text-red-400" : "text-red-600"} 
          size={24} 
        />
        <h3 
          className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Top 5 Spending Categories
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Pie chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={topCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) =>
                  `${category} ${(percent * 100).toFixed(1)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {topCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Amount"]}
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#ffffff",
                  border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  color: isDark ? "#ffffff" : "#000000",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category list */}
        <div className="flex-1">
          <div className="space-y-3">
            {topCategories.map((item, index) => (
              <div
                key={item.category}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span 
                    className={`font-medium capitalize ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
                <span 
                  className={`font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSpendingCategories;