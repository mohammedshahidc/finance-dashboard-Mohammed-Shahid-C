import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export const BudgetContext = createContext();
export const baseurl = "https://finance-dashboard-mohammed-shahid-c-1.onrender.com";

const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(`${baseurl}/budget`);
      setBudgets(res.data); 
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
      toast.error("Failed to load budgets");
    }
  };
  const addBudget = async (budgetData) => {
    try {
      const res = await axios.post(`${baseurl}/budget`, budgetData);
      setBudgets([...budgets, res.data]);
      toast.success("Budget Saved Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save budget");
    }
  };

  const getMonthlyBudgets = (month = dayjs().month() + 1, year = dayjs().year()) => {
    return budgets.filter((b) => b.month === month && b.year === year);
  };

useEffect(()=>{
  fetchBudgets()
},[])
  return (
    <BudgetContext.Provider
      value={{ budgets, addBudget, getMonthlyBudgets }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetProvider;
