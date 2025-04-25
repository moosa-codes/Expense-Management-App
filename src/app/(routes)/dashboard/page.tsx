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
import { NotebookPen, PenBox } from "lucide-react";
import { useRouter } from "next/navigation";

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
    const route = useRouter();

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
        <div className="p-6 md:p-8 space-y-8 ml-4">

            <div className="space-y-2">
                <h1 className="font-bold text-3xl md:text-4xl text-gray-800">
                    Hey! {user?.fullName} 👋
                </h1>
                <p className="text-gray-600 text-lg">Let&aposs track your finances today!</p>
            </div>

            <div className="space-y-6">
                <CardInfo budgetList={budgets} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                <div className="lg:col-span-3 space-y-6">

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-semibold text-xl text-gray-800 mb-4">Spending Overview</h2>
                        <BarChartDashBoard budgets={budgets} />
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-semibold text-xl text-gray-800 mb-4">Recent Expenses</h2>
                        <ExpenseListTable
                            expensesList={expensesList}
                            refreshData={() => fetchBudgets()}
                        />
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="font-semibold text-xl text-gray-800 mb-4">Latest Budgets</h2>
                        <div className="space-y-4">
                            {budgets.map((item, index) => (
                                <BudgetItem budget={item} key={index} />
                            ))}

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => route.push('/dashboard/budgets')}
                                    className="flex items-center justify-center gap-2 px-4 py-2 w-full rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 font-medium"
                                >
                                    <NotebookPen className="h-4 w-4" />
                                    Add Expense
                                </button>

                                <button
                                    onClick={() => route.push(`/dashboard/expenses/}`)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 font-medium lg:w-[100px]"
                                >
                                    <PenBox />
                                    Create Budget
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
