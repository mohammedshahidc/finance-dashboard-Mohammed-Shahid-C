import { useState } from 'react'
import './App.css'
import Navbar from './components/common/Navbar'
import TransactionForm from './components/forms/TransactionForm'
import BudgetForm from './components/forms/BudgetForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Navbar/>
     {/* <TransactionForm/> */}
     <BudgetForm/>
    </>
  )
}

export default App
