import React, { useMemo, useContext } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Target } from "lucide-react";
import dayjs from "dayjs";
import { TransactionContext } from "../../context/TransactionContext";
import { BudgetContext } from "../../context/budgetContext";

// Different color sets for light and dark modes
const LIGHT_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f43f5e",
  "#6366f1",
  "#84cc16",
  "#06b6d4",
];

const DARK_COLORS = [
  "#60a5fa",
  "#f87171",
  "#34d399",
  "#fbbf24",
  "#a78bfa",
  "#f472b6",
  "#2dd4bf",
  "#fb7185",
  "#818cf8",
  "#a3e635",
  "#22d3ee",
];

const BudgetVsActualChart = ({ isDark, currency = "₹" }) => {
  const { transactions } = useContext(TransactionContext);
  const { budgets } = useContext(BudgetContext);

  const budgetComparison = useMemo(() => {
    const now = dayjs();
    const currentMonth = now.month() + 1; 
    const currentYear = now.year();

    // Find current month budget entry
    const currentBudgetEntry = budgets?.find(
      (b) => b.month === currentMonth && b.year === currentYear
    );

    if (!currentBudgetEntry) return [];

    const budgetCategories = currentBudgetEntry.categories || {};

    // Filter current month expenses
    const monthlyExpenses = transactions.filter((t) => {
      const d = dayjs(t.date);
      return (
        t.type === "expense" &&
        d.month() + 1 === currentMonth &&
        d.year() === currentYear
      );
    });

    // Sum actual spending per category
    const actualSpending = monthlyExpenses.reduce((acc, t) => {
      const category = (t.category || "other").toLowerCase();
      acc[category] = (acc[category] || 0) + parseFloat(t.amount || 0);
      return acc;
    }, {});

    // Merge with budgets
    return Object.keys(budgetCategories).map((category) => {
      const budget = budgetCategories[category] || 0;
      const actual = actualSpending[category.toLowerCase()] || 0;
      return {
        name: category,
        budget,
        actual,
        remaining: budget - actual,
      };
    });
  }, [transactions, budgets]);

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const formatCurrency = (value) => {
    return `${currency}${value.toFixed(2)}`;
  };

  console.log("budgets:", budgets);
  console.log("transactions:", transactions);
  console.log("budgetComparison:", budgetComparison);
  
  return (
    <div
      className={`p-6 rounded-2xl shadow-md transition-colors ${
        isDark 
          ? "bg-black" 
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Target 
          className={isDark ? "text-purple-400" : "text-purple-600"} 
          size={24} 
        />
        <h3 
          className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Budget vs Actual Spending
        </h3>
      </div>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={budgetComparison}
            dataKey="actual"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={(entry) =>
              `${entry.name}: ${formatCurrency(entry.actual)}`
            }
          >
            {budgetComparison.map((_, index) => (
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
          <Legend 
            wrapperStyle={{
              color: isDark ? "#ffffff" : "#000000",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Category Breakdown */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetComparison.map((item, index) => (
          <div 
            key={item.name} 
            className={`p-4 rounded-lg ${
              isDark ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <h4 
                className={`font-medium capitalize ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {item.name}
              </h4>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Budget:
                </span>
                <span 
                  className={`font-medium ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {formatCurrency(item.budget)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Actual:
                </span>
                <span 
                  className={`font-medium ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {formatCurrency(item.actual)}
                </span>
              </div>
              <div
                className={`flex justify-between font-medium ${
                  item.remaining >= 0 
                    ? (isDark ? "text-green-400" : "text-green-600")
                    : (isDark ? "text-red-400" : "text-red-600")
                }`}
              >
                <span>Remaining:</span>
                <span>{formatCurrency(item.remaining)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetVsActualChart;