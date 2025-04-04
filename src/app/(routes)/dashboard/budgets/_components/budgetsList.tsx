'use client';

import React, { useEffect, useState } from "react";
import CreateBudgets from "./CreateBudgets";
import { db } from "../../../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./budgetItem";

interface Budget {
  id: string | number;
  name: string;
  amount: number;
  emoji: string;
  totalSpend: number;
  totalItems: number | 0;
}

function BudgetsList() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);


  const fetchBudgets = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;

    if (email) {
      const result = await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
        .from(Budgets)
        .where(eq(Budgets.createdBy, email))
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      const transformedBudgets = result.map((budget): Budget => ({
        id: budget.id,
        name: budget.name,
        amount: Number(budget.amount), 
        emoji: budget.emojiIcon || '',
        totalSpend: budget.totalSpend || 0,
        totalItems: budget.totalItem || 0, 
      }));


      setBudgets(transformedBudgets || [])
    }
  };


  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CreateBudgets
          refreshData={() => fetchBudgets()}
        />
        {budgets.length > 0 ?
          budgets.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))
          : [1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="w-full bg-slate-200 rounded-lg h-[180px] animate-pulse">
              {/* loader */}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default BudgetsList;
