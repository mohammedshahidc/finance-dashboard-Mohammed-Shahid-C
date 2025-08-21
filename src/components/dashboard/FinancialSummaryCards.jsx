import React, { useContext } from "react";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { TransactionContext } from "../../context/TransactionContext";

const formatCurrency = (amount, currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount || 0);

const FinancialSummaryCards = ({ isDark, currency }) => {
  const { transactions } = useContext(TransactionContext);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const currentBalance = Math.max(0, totalIncome - totalExpenses);

  const savingsGoal = 50000;
  const savingsProgress =
    totalIncome > 0
      ? Math.min((currentBalance / savingsGoal) * 100, 100)
      : 0;

  const cardData = [
    {
      title: "Total Income",
      amount: totalIncome,
      icon: TrendingUp,
      gradient: "from-green-400 to-emerald-500",
    },
    {
      title: "Total Expenses",
      amount: Math.max(0, totalExpenses),
      icon: TrendingDown,
      gradient: "from-red-400 to-rose-500",
    },
    {
      title: "Current Balance",
      amount: currentBalance,
      icon: DollarSign,
      gradient: "from-blue-400 to-indigo-500", // always blue since clamped
    },
    {
      title: "Savings Progress",
      amount: savingsProgress,
      icon: Target,
      isPercentage: true,
      gradient: "from-purple-400 to-pink-500",
    },
  ];

  return (
    <div
      className={`${
        isDark
          ? "bg-black"
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      } grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-6 mb-8`}
    >
      {cardData.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${
              isDark
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/70 border-gray-200/50 backdrop-blur-sm"
            } rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              {card.isPercentage && (
                <div
                  className={`text-sm px-3 py-1 rounded-full ${
                    isDark
                      ? "bg-gray-700/70 text-gray-300"
                      : "bg-gray-100/70 text-gray-600"
                  } backdrop-blur-sm`}
                >
                  Goal: {formatCurrency(savingsGoal, currency)}
                </div>
              )}
            </div>
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              } mb-1`}
            >
              {card.title}
            </h3>
            <p
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {card.isPercentage
                ? `${card.amount.toFixed(1)}%`
                : formatCurrency(card.amount, currency)}
            </p>
            {card.isPercentage && savingsGoal > 0 && (
              <div
                className={`mt-3 w-full ${
                  isDark ? "bg-gray-700/50" : "bg-gray-200/50"
                } rounded-full h-2 backdrop-blur-sm`}
              >
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${Math.min(card.amount, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FinancialSummaryCards;
