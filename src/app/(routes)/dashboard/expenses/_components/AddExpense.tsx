'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { db } from "../../../../../../utils/dbConfig";
import { Expenses } from "../../../../../../utils/schema";
import { toast } from "sonner";
import moment from 'moment';
import { Loader } from "lucide-react";

interface Props {
    budgetId: string; // Ensure this is a string or convert appropriately
    refreshData: () => void;
}

function AddExpense({ budgetId, refreshData }: Props) {
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
    const [loader, setLoader] = useState(false);

    const addNewExpenseHandler = async () => {
        if (!expenseName || !expenseAmount) {
            toast.error("Please fill out all fields.");
            return;
        }
    
        setLoader(true);
    
        try {
            const parsedBudgetId = Number(budgetId);
    
            if (isNaN(parsedBudgetId)) {
                toast.error("Invalid budget ID.");
                setLoader(false);
                return;
            }
    
            // Insert data into the database
            const result = await db.insert(Expenses).values({
                name: expenseName,               // varchar
                amount: expenseAmount.toString(), // numeric 
                budgetId: parsedBudgetId,        // integer
                createdAt: moment().format('YYYY-MM-DD'), // varchar 
            });
    
            if (result) {
                toast.success("New Expense Added!");
                refreshData();
                setExpenseName('');
                setExpenseAmount('');
            }
        } catch (error) {
            console.error("Error adding expense:", error);
            toast.error("Failed to add expense.");
        } finally {
            setLoader(false);
        }
    };
    

    return (
        <div>
            <h2 className="font-bold text-lg">Add Expense</h2>
            <div className="mt-4">
                <h2 className="text-black font-medium my-1">Expense Title:</h2>
                <input
                    type="text"
                    placeholder="e.g. Crockery"
                    className="w-full h-[40px] text-center border"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <h2 className="text-black font-medium my-1">Expense Amount:</h2>
                <input
                    type="number"
                    placeholder="e.g. 1000"
                    className="w-full h-[40px] text-center border"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value) || '')}
                />
            </div>
            <Button
                className="mt-3 w-full"
                disabled={!expenseName || !expenseAmount}
                onClick={addNewExpenseHandler}
            >
                {loader ? <Loader className="animate-spin" /> : "Add New Expense"}
            </Button>
        </div>
    );
}

export default AddExpense;
