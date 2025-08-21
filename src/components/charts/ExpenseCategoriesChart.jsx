import React, { useContext } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TransactionContext } from "../../context/TransactionContext";

const categoryColors = {
  Food: "#ff6384",
  Transport: "#36a2eb",
  Entertainment: "#ffce56",
  Shopping: "#4bc0c0",
  Other: "#9966ff",
};

const formatCurrency = (value, currency) => {
  return `${currency}${value.toLocaleString()}`;
};

const ExpenseCategoriesChart = ({ isDark, currency }) => {
  const { transactions } = useContext(TransactionContext);

  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const category = transaction.category || "Other";
      const amount = Number(transaction.amount);
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});

  const chartData = Object.entries(expenseData).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: categoryColors[category] || "#999999",
  }));

  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      className={`flex flex-col lg:flex-row items-center rounded-2xl shadow-md p-6 transition-colors ${
        isDark ? "bg-black" : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      }`}
    >
      {/* Chart */}
      <div className="w-full lg:w-1/2 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={120}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatCurrency(value, currency), "Amount"]}
              contentStyle={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff", // darker bg for dark mode
                border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                borderRadius: "12px",
                color: isDark ? "#ffffff" : "#000000",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="w-full lg:w-1/2 lg:pl-6 mt-4 lg:mt-0 space-y-2">
        {chartData.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded mr-2"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                {category.name}
              </span>
            </div>
            <span
              className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {formatCurrency(category.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseCategoriesChart;
