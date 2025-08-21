import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../context/userContext';
import ExportDataCSV from '../components/dashboard/ExportDataCSV';
import MonthlyIncomeExpensesChart from '../components/charts/MonthlyIncomeExpensesChart';
import TopSpendingCategories from '../components/charts/TopSpendingCategories';
import BudgetVsActualChart from '../components/charts/BudgetVsActualChart';

const ReportsSettings = () => {
  const { user } = useContext(userContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      setIsDarkMode(storedDarkMode === "true");
    }

    const checkAndUpdateDarkMode = () => {
      const currentStoredValue = localStorage.getItem("darkMode") === "true";
      if (currentStoredValue !== isDarkMode) {
        setIsDarkMode(currentStoredValue);
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'darkMode' && e.newValue !== null) {
        setIsDarkMode(e.newValue === "true");
      }
    };

    const handleCustomDarkModeChange = (e) => {
      setIsDarkMode(e.detail.isDarkMode);
    };

    const handleFocus = () => {
      checkAndUpdateDarkMode();
    };

    const pollInterval = setInterval(checkAndUpdateDarkMode, 500);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('darkModeChange', handleCustomDarkModeChange);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        checkAndUpdateDarkMode();
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('darkModeChange', handleCustomDarkModeChange);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', checkAndUpdateDarkMode);
      clearInterval(pollInterval);
    };
  }, [isDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
<div className={`${isDarkMode ? 'bg-black' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'} p-6`}>
<MonthlyIncomeExpensesChart isDark={isDarkMode} currency={user ? user.currency : 'USD'} />
      <TopSpendingCategories isDark={isDarkMode} currency={user ? user.currency : 'USD'} />
      <BudgetVsActualChart isDark={isDarkMode} currency={user ? user.currency : 'USD'} />
      <ExportDataCSV isDark={isDarkMode} />
    </div>
  )
}

export default ReportsSettings;
