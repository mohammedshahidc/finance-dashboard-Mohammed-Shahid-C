import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export const BudgetContext = createContext();
const baseurl = "http://localhost:3000";

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

  const updateBudget = async (id, updatedData) => {
    try {
      const res = await axios.put(`${baseurl}/budget/${id}`, updatedData);
      setBudgets(budgets.map((b) => (b.id === id ? res.data : b)));
      toast.success("Budget Updated Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update budget");
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`${baseurl}/budget/${id}`);
      setBudgets(budgets.filter((b) => b.id !== id));
      toast.success("Budget Deleted Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete budget");
    }
  };

  const getMonthlyBudgets = (month = dayjs().month() + 1, year = dayjs().year()) => {
    return budgets.filter((b) => b.month === month && b.year === year);
  };


  return (
    <BudgetContext.Provider
      value={{ budgets, addBudget, updateBudget, deleteBudget, getMonthlyBudgets }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetProvider;
