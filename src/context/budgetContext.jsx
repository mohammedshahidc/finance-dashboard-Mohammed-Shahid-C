import React, { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const BudgetContext = createContext();

const baseurl='http://localhost:3000'
const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState({});
  const addBudgt=async(budgetData)=>{
    try {
      await axios.post(`${baseurl}/budget`,budgetData)
      toast.success("Budget Added Successfully")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <BudgetContext.Provider value={{ addBudgt }}>
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetProvider;
