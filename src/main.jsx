import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BudgetProvider from './context/budgetContext.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionProvider from './context/TransactionContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './context/userContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TransactionProvider>
      <BudgetProvider>
        <UserContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserContextProvider>
      </BudgetProvider>
    </TransactionProvider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  </StrictMode>,
)
