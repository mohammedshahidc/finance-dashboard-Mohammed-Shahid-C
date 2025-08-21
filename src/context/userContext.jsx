import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "./budgetContext";

export const userContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const res = await axios.get(`${baseurl}/user`);
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const updateUser = async (userData) => {
    try {
      await axios.put(`${baseurl}/user`, userData);
      await getUser(); // refresh after update
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <userContext.Provider value={{ user, updateUser, getUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
