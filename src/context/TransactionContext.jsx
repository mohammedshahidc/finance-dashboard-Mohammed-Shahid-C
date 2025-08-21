import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { baseurl } from "./budgetContext";
export const TransactionContext = createContext();


const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [transactionsById, setTransactionsById] = useState([]);

  // ✅ Fetch all transactions
  const getTransactions = async () => {
    try {
      const res = await axios.get(`${baseurl}/transactions`);
      setTransactions(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch transactions");
    }
  };
  const getTransactionsById = async (id) => {
    try {
      const res = await axios.get(`${baseurl}/transactions/${id}`);
      setTransactionsById(res.data);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch transactions");
    }
  };


  // ✅ Add transaction
  const addTransaction = async (transactionData) => {
    try {
      const res = await axios.post(`${baseurl}/transactions`, transactionData);
getTransactions()
      toast.success("Transaction Added!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add transaction");
    }
  };

  // ✅ Update transaction
  const updateTransaction = async (id, updatedData) => {
    try {
      const res = await axios.put(`${baseurl}/transactions/${id}`, updatedData);
getTransactions()
      toast.success("Transaction Updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction");
    }
  };

  // ✅ Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${baseurl}/transactions/${id}`);
getTransactions()
      toast.success("Transaction Deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction");
    }
  };

  // ✅ Get transactions for current month
  const getMonthlyTransactions = (month = dayjs().month() + 1, year = dayjs().year()) => {
    return transactions.filter(
      (t) => dayjs(t.date).month() + 1 === month && dayjs(t.date).year() === year
    );
  };

  // ✅ Filter transactions (by category, type, date range, search)
  const filterTransactions = ({
    category,
    type,
    startDate,
    endDate,
    search
  }) => {
    return transactions.filter((t) => {
      const matchCategory = category ? t.category === category : true;
      const matchType = type ? t.type === type : true;
      const matchSearch = search ? t.description?.toLowerCase().includes(search.toLowerCase()) : true;
      const matchDate =
        startDate && endDate
          ? dayjs(t.date).isAfter(dayjs(startDate).subtract(1, "day")) &&
            dayjs(t.date).isBefore(dayjs(endDate).add(1, "day"))
          : true;

      return matchCategory && matchType && matchSearch && matchDate;
    });
  };

  // Load on mount
  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactions,
        getMonthlyTransactions,
        filterTransactions,
        getTransactionsById,
        transactionsById
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
