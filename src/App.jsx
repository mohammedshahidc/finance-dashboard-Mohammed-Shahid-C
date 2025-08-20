import { useState } from 'react'
import './App.css'
import Navbar from './components/common/Navbar'
import TransactionForm from './components/forms/TransactionForm'
import BudgetForm from './components/forms/BudgetForm'
import TransactionsList from './components/dashboard/TransactionsList'
import { Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Navbar/>
     <Routes>
      <Route path='/' element={<TransactionsList/>} />
    <Route path='/transactions/edit/:id' element={<TransactionForm/>}/>

     </Routes>
     {/* <TransactionForm/> */}
     {/* <BudgetForm/> */}
    </>
  )
}

export default App
