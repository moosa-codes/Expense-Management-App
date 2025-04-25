import React from 'react'
import BudgetsList from './_components/budgetsList'

export default function Budgets() {
  return (
    <div className='p-6 ml-10'>
      <h2 className='font-bold text-3xl mt-3'>My Budgets</h2>
      <BudgetsList />
    </div>
  )
}
