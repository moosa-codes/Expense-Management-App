'use client';
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from 'react'
import EmojiPicker from "emoji-picker-react";
import { db } from "../../../../../../utils/dbConfig";
import { Budgets } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

type Props = {
    budgetInfo: Budget | null,
    refreshData: () => void
}

interface Budget {
    id: string | number;
    name: string;
    amount: number;
    emoji: string;
    totalSpend: number;
    totalItems: number;
}

function EditBudgetComp({ budgetInfo, refreshData }: Props) {

    const [emoji, setEmoji] = useState(budgetInfo?.emoji);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState(budgetInfo?.name);
    const [amount, setAmount] = useState(budgetInfo?.amount);

    useEffect(() => {
        if (budgetInfo) {
            setEmoji(budgetInfo.emoji);
            setName(budgetInfo.name);
            setAmount(budgetInfo.amount);
        }
    }, [budgetInfo]);
    

    const updateBudgetComp = async () => {
        if (!budgetInfo) return;

        const result = await db.update(Budgets).set({
            name: name,
            amount: amount?.toString(),
            emojiIcon: emoji || '😃',
        }).where(eq(Budgets.id, Number(budgetInfo.id)))

        if (result) {
            toast('Budget Updated Successfully.');
            refreshData();
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Edit Budget <PenBox /></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Budget4</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button
                                    size="lg"
                                    className='text-lg'
                                    variant="outline"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>{emoji}</Button>
                                <div className='absolute'>
                                    <EmojiPicker
                                        open={openEmojiPicker}
                                        onEmojiClick={(e) => setEmoji(e.emoji)}
                                    />
                                </div>
                                <div className='mt-4'>
                                    <h2 className='text-black font-medium my-1'>Budget Title</h2>
                                    <input
                                        type="text"
                                        placeholder='e.g home'
                                        className='w-full h-[40px] text-center'
                                        defaultValue={budgetInfo?.name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='mt-4'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <input
                                        type="number"
                                        placeholder='e.g 100$'
                                        className='w-full h-[40px] text-center'
                                        defaultValue={budgetInfo?.amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!name && !amount}
                                onClick={updateBudgetComp}
                                className='mt-5 w-full'>Save Budget</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudgetComp;
