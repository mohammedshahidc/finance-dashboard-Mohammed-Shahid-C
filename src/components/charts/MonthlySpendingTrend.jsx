import React, { useContext } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { TransactionContext } from "../../context/TransactionContext";

// Helper: Format currency
const formatCurrency = (value, currency) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 0,
  }).format(value);
};

const MonthlySpendingTrend = ({ isDark, currency }) => {
  const { transactions } = useContext(TransactionContext);

  // Prepare last 6 months data
  const generateMonthlyData = () => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      const monthlySpending = transactions
        .filter((t) => t.type === "expense" && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      months.push({
        month: monthName,
        spending: monthlySpending,
      });
    }

    return months;
  };

  const monthlyData = generateMonthlyData();
  const hasData = monthlyData.some((month) => month.spending > 0);

  return (
    <div
      className={`w-full rounded-xl p-6 shadow-md ${
        isDark ? "bg-black" : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      }`}
    >
      <h2
        className={`text-lg font-semibold mb-4 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Monthly Spending Trend
      </h2>

      {!hasData ? (
        <div
          className={`text-center py-12 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No spending data available</p>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="month"
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                fontSize={12}
              />
              <YAxis
                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                fontSize={12}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value, currency), "Spending"]}
                contentStyle={{
                  backgroundColor: isDark ? "#374151" : "#ffffff",
                  border: `1px solid ${isDark ? "#4B5563" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  color: isDark ? "#ffffff" : "#000000",
                }}
              />
              <Line
                type="monotone"
                dataKey="spending"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#8B5CF6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MonthlySpendingTrend;
