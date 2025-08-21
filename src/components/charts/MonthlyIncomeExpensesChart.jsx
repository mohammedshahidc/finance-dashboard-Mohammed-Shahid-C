import React, { useContext, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { TransactionContext } from "../../context/TransactionContext";

// Colors for pie slices - different for light and dark modes
const LIGHT_COLORS = ["#10b981", "#ef4444"]; // green = income, red = expenses
const DARK_COLORS = ["#34d399", "#f87171"]; // brighter versions for dark mode

const MonthlyIncomeExpensesChart = ({ isDark, currency = "$" }) => {
  const { transactions } = useContext(TransactionContext);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const expenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    return [
      { name: "Income", value: income },
      { name: "Expenses", value: expenses },
    ];
  }, [transactions]);

  const totalIncome = monthlyData[0]?.value || 0;
  const totalExpenses = monthlyData[1]?.value || 0;
  const balance = totalIncome - totalExpenses;

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

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
        <TrendingUp 
          className={isDark ? "text-blue-400" : "text-blue-600"} 
          size={24} 
        />
        <h3 
          className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Monthly Income vs Expenses
        </h3>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={monthlyData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {monthlyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div 
          className={`text-center p-3 rounded-lg ${
            isDark ? "bg-gray-800" : "bg-green-50"
          }`}
        >
          <div 
            className={`text-2xl font-bold ${
              isDark ? "text-green-400" : "text-green-600"
            }`}
          >
            {formatCurrency(totalIncome)}
          </div>
          <div className={isDark ? "text-gray-300" : "text-gray-600"}>
            Total Income
          </div>
        </div>
        
        <div 
          className={`text-center p-3 rounded-lg ${
            isDark ? "bg-gray-800" : "bg-red-50"
          }`}
        >
          <div 
            className={`text-2xl font-bold ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            {formatCurrency(totalExpenses)}
          </div>
          <div className={isDark ? "text-gray-300" : "text-gray-600"}>
            Total Expenses
          </div>
        </div>
        
        <div
          className={`text-center p-3 rounded-lg ${
            balance >= 0 
              ? (isDark ? "bg-gray-800" : "bg-blue-50")
              : (isDark ? "bg-gray-800" : "bg-orange-50")
          }`}
        >
          <div
            className={`text-2xl font-bold ${
              balance >= 0 
                ? (isDark ? "text-blue-400" : "text-blue-600")
                : (isDark ? "text-orange-400" : "text-orange-600")
            }`}
          >
            {formatCurrency(Math.abs(balance))}
          </div>
          <div className={isDark ? "text-gray-300" : "text-gray-600"}>
            {balance >= 0 ? "Surplus" : "Deficit"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyIncomeExpensesChart;