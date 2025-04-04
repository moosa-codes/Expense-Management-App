'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../../utils/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/budgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudgetComp from '../_components/EditBudgetComp';


// interface Budget {
//     id: string | number;
//     name: string;
//     amount: number;
//     emoji: string;
//     totalSpend: number;
//     totalItems: number;
// }

// interface PrpType {
//     params: {
//         id: string;
//     };
// }

// interface Expense {
//     id: number;
//     name: string;
//     amount: string;
//     budgetId: number | null;
//     createdAt: string;
// }


function DisplayExpenses({ params }) {

    const { user } = useUser(); // Clerk user context
    const [budgetInfo, setBudgetInfo] = useState(null);
    const [expensesList, setExpensesList] = useState([]);

    const route = useRouter();

    useEffect(() => {
        if (user) fetchBudgetInfo();
    }, [user]);


    /* fetch budget info */
    const fetchBudgetInfo = async () => {
        const email = user?.primaryEmailAddress?.emailAddress;

        if (email) {
            try {
                const result = await db
                    .select({
                        id: Budgets.id,
                        name: Budgets.name,
                        amount: Budgets.amount,
                        emojiIcon: Budgets.emojiIcon,
                        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                        totalItems: sql`count(${Expenses.id})`.mapWith(Number),
                    })
                    .from(Budgets)
                    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
                    .where(
                        sql`${Budgets.createdBy} = ${email} AND ${Budgets.id} = ${params.id}`
                    )
                    .groupBy(Budgets.id);

                const transformedBudget = result.map((budget) => ({
                    id: budget.id,
                    name: budget.name,
                    amount: Number(budget.amount),
                    emoji: budget.emojiIcon || '',
                    totalSpend: budget.totalSpend || 0,
                    totalItems: budget.totalItems || 0,
                }))[0];

                setBudgetInfo(transformedBudget || null);
                getExpenseList();
            } catch (error) {
                console.error('Error fetching budget info:', error);
            }
        }
    };

    /* Get Latest Expenses */
    const getExpenseList = async () => {
        const budgetId = parseInt(params.id, 10);
        if (isNaN(budgetId)) {
            console.error('Invalid budget ID');
            return;
        }

        try {
            const result = await db
                .select()
                .from(Expenses)
                .where(eq(Expenses.budgetId, budgetId))
                .orderBy(desc(Expenses.id));

            setExpensesList(result);
            console.log(result);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };


    /* DeleteBudget handler */
    const deleteBudgetPermanently = async () => {
        const budgetId = parseInt(params.id, 10);

        const deleteExpSuccessor = await db
            .delete(Expenses).where(eq(Expenses.budgetId, budgetId))
            .returning();

        if (deleteExpSuccessor) {
            const result = await db
                .delete(Budgets)
                .where(eq(Budgets.id, budgetId))
                .returning();
            if (result) {
                toast('Your budget has been deleted permanently.');
                route.push('/dashboard/budgets');
            }
        }
    }

    return (
        <div className="p-10 rounded-lg">
            <div className='flex justify-between mt-[50px] items-center'>
                <h2 className="text-2xl font-bold flex justify-between">My Expenses</h2>
                <div className='flex gap-2 items-center'>
                    <EditBudgetComp
                        budgetInfo={budgetInfo}
                        refreshData={() => fetchBudgetInfo()}
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                className='flex gap-2'
                                variant={'destructive'}>
                                Delete Budget<Trash />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure to delete this budget?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently
                                    delete your Budgets and Expenses
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteBudgetPermanently}>Delete Permanently</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo} />
                ) : (
                    <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
                )}
                <AddExpense
                    budgetId={params.id}
                    refreshData={fetchBudgetInfo} />
            </div>
            <div className='mt-4'>
                <h1 className='font-bold text-lg'>Latest Expenses</h1>
                <ExpenseListTable
                    expensesList={expensesList}
                    refreshData={fetchBudgetInfo}
                />
            </div>
        </div>
    );
}

export default DisplayExpenses;
