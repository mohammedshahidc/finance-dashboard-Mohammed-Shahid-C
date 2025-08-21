import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export const BudgetContext = createContext();
export const baseurl = "http://localhost:3000";

const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);

 
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


  return (
    <BudgetContext.Provider
      value={{ budgets, addBudget, getMonthlyBudgets }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetProvider;
