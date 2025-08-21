import { useState } from 'react'
import './App.css'
import Navbar from './components/common/Navbar'
import TransactionForm from './components/forms/TransactionForm'
import BudgetForm from './components/forms/BudgetForm'
import TransactionsList from './components/dashboard/TransactionsList'
import { Route, Routes } from 'react-router-dom'
import SettingsComponent from './components/settings/SettingsComponent'
import Dashboard from './pages/Dashboard'
import MonthlyIncomeExpensesChart from './components/charts/MonthlyIncomeExpensesChart'
import TopSpendingCategories from './components/charts/TopSpendingCategories'
import BudgetVsActualChart from './components/charts/BudgetVsActualChart'
import ReportsSettings from './pages/ReportsSettings'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Navbar/>
     <Routes>
     <Route path='/' element={<Dashboard/>} />
      <Route path='/transactions' element={<TransactionsList/>} />
      <Route path='/budgetform' element={<BudgetForm/>} />
      <Route path='/settings' element={<SettingsComponent/>} />
      <Route path='/transactions/edit/:id' element={<TransactionForm/>}/>
      <Route path='/addtransaction' element={<TransactionForm/>}/>

      <Route path='reports' element={<ReportsSettings/>}/>

     </Routes>
    
    </>
  )
}

export default App
