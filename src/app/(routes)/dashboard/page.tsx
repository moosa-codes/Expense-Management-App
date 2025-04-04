'use client';

import { useUser } from "@clerk/nextjs";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import { db } from "../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../utils/schema";
import { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import BarChartDashBoard from "./_components/BarChartDashBoard";
import BudgetItem from "./budgets/_components/budgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import Footer from "@/app/_components/Footer";
import moment from "moment";

interface Budget {
    id: string | number;
    name: string;
    amount: number;
    emoji: string;
    totalSpend: number;
    totalItems: number;
}

interface Expense {
    id: number | string;
    name: string;
    amount: number;
    createdAt: string;
}

export default function Dashboard() {
    const { user } = useUser(); //user context
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [expensesList, setExpensesList] = useState<Expense[]>([]);

    useEffect(() => {
        if (user) {
            fetchBudgets();
        }
    }, [user]);


    /* used to fetch and display all the budgets vreated by user */
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

            setBudgets(transformedBudgets || []);
            fetchAllExpenses();
        }
    };

    /* Used to get all expnenses belong to users */
    const fetchAllExpenses = async () => {
        const email = user?.primaryEmailAddress?.emailAddress;

        const result = await db.select({
            id: Expenses.id,
            name: Expenses.name,
            amount: Expenses.amount,
            createdAt: Expenses.createdAt,
        }).from(Budgets).rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, email!)).orderBy(desc(Expenses.id));

        const transformedExpenses = result.map((expense): Expense => ({
            id: expense.id,
            name: expense.name,
            amount: Number(expense.amount),
            createdAt: moment(expense.createdAt).format("DD/MM/YYYY"),
        }));

        setExpensesList(transformedExpenses);
    }

    return (
        <div className="mr-10 p-5">
            <h1 className="font-bold text-3xl">Hey! {user?.fullName} 👋</h1>
            <p>Let&apos;s look up your money!</p>
            <CardInfo budgetList={budgets} /> {/* CardInfo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="col-span-2">
                    <BarChartDashBoard budgets={budgets} /> {/* BarChart */}
                    <ExpenseListTable
                        expensesList={expensesList}
                        refreshData={() => fetchBudgets()}
                    />
                </div>
                <div >
                    <h2 className="font-bold text-lg mt-5">Latest Budgets</h2>
                    {budgets.map((item, index) => (
                        <BudgetItem budget={item} key={index} />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
