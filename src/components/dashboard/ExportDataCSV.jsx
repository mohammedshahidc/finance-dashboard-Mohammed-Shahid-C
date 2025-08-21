import React, { useContext, useState } from "react";
import { Download, FileDown, Check } from "lucide-react";
import { TransactionContext } from "../../context/TransactionContext";
import { BudgetContext } from "../../context/budgetContext";


const ExportDataCSV = ({ fileName = "finance_data", isDark }) => {
  const { transactions } = useContext(TransactionContext);
  const { budgets } = useContext(BudgetContext);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Convert array of objects to CSV
  const convertToCSV = (data, headers) => {
    if (!data.length) return "";
    const csvContent = [
      headers.join(","), // header row
      ...data.map((item) =>
        headers.map((key) => `"${(item[key] ?? "").toString().replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");
    return csvContent;
  };

  const downloadCSV = () => {
    setIsExporting(true);
    try {
      let csvSections = [];
      
      // Transactions section
      if (transactions.length > 0) {
        const transactionHeaders = ["date", "description", "category", "type", "amount"];
        const transactionCSV = convertToCSV(transactions, transactionHeaders);
        csvSections.push("Transactions\n" + transactionCSV);
      }
      
      // Budgets section
      if (budgets.length > 0) {
        const budgetHeaders = ["category", "amount", "month", "year"];
        const budgetCSV = convertToCSV(budgets, budgetHeaders);
        csvSections.push("\n\nBudgets\n" + budgetCSV);
      }
      
      if (csvSections.length === 0) {
        alert("No data available to export");
        setIsExporting(false);
        return;
      }
      
      const finalCSV = csvSections.join("\n\n");
      const blob = new Blob([finalCSV], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `${fileName}_${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        setIsExporting(false);
      }, 2000);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
      setIsExporting(false);
    }
  };

  return (
    <div
      className={`w-full rounded-xl p-6 shadow-md ${
        isDark ? "bg-black" : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className={`text-lg font-semibold mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Export Finance Data
          </h3>
          <p
            className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Download transactions and budgets as a CSV file
          </p>
        </div>
        <FileDown 
          className={`w-6 h-6 ${
            isDark ? "text-indigo-400" : "text-indigo-500"
          }`} 
        />
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`text-sm ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <span className="font-medium">{transactions.length}</span> transactions,{" "}
          <span className="font-medium">{budgets.length}</span> budgets
        </div>
        
        <button
          onClick={downloadCSV}
          disabled={isExporting || (transactions.length === 0 && budgets.length === 0)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            ${exportSuccess 
              ? isDark
                ? 'bg-green-600 text-white' 
                : 'bg-green-500 text-white'
              : isDark
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500'
            }
          `}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Exporting...
            </>
          ) : exportSuccess ? (
            <>
              <Check className="w-4 h-4" />
              Exported!
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export CSV
            </>
          )}
        </button>
      </div>

      {transactions.length === 0 && budgets.length === 0 && (
        <div
          className={`mt-4 p-3 rounded-md border ${
            isDark
              ? "bg-yellow-900/20 border-yellow-800 text-yellow-200"
              : "bg-yellow-50 border-yellow-200 text-yellow-800"
          }`}
        >
          <p className="text-sm">
            No data available to export. Add some transactions or budgets first.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExportDataCSV;