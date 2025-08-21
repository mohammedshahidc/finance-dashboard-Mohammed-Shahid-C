import { useState } from 'react'
import './App.css'
import Navbar from './components/common/Navbar'
import TransactionForm from './components/forms/TransactionForm'
import BudgetForm from './components/forms/BudgetForm'
import TransactionsList from './components/dashboard/TransactionsList'
import { Route, Routes } from 'react-router-dom'
import SettingsComponent from './components/settings/SettingsComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Navbar/>
     <Routes>
      <Route path='/transactions' element={<TransactionsList/>} />
      <Route path='/budgetform' element={<BudgetForm/>} />
      <Route path='/settings' element={<SettingsComponent/>} />
      <Route path='/transactions/edit/:id' element={<TransactionForm/>}/>

     </Routes>
     
    </>
  )
}

export default App
