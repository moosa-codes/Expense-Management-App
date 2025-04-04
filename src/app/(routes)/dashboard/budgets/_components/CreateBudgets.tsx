'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { db } from '../../../../../../utils/dbConfig';
import { Budgets } from '../../../../../../utils/schema';

function CreateBudgets({ refreshData }: { refreshData: () => void; }) {
    const { user } = useUser(); // Clerk user

    const [emoji, setEmoji] = useState('😃'); // Emoji state
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false); // Toggler state
    const [name, setName] = useState<string>(''); // Budget name state
    const [amount, setAmount] = useState<string>(''); // Budget amount state

    // Budget handler (save and refresh)
    const saveBudgetHandler = async () => {
        try {
            const parsedAmount = parseFloat(amount);
            if (!name || isNaN(parsedAmount) || parsedAmount <= 0) {
                toast.error('Please provide a valid name and a positive amount.');
                return;
            }

            // Insert budget into the database
            await db.insert(Budgets).values({
                name, // Budget name
                amount: parsedAmount.toString(), // Convert amount to string
                createdBy: user?.primaryEmailAddress?.emailAddress || 'Unknown User', // Creator email
                emojiIcon: emoji, // Selected emoji
            });

            // Handle success
            refreshData(); // Refresh parent component data
            toast.success('Your Budget Has Been Created!');
            setName(''); // Reset form fields
            setAmount('');
            setEmoji('😃');
        } catch (error) {
            console.error('Failed to save budget:', error);
            toast.error('Failed to create the budget. Please try again.');
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className="bg-slate-100 p-10 rounded-md flex
                     items-center flex-col border-2 border-dashed
                    cursor-pointer hover:shadow-md mt-6 h-[160px]">
                        <h2>+</h2>
                        <h2>Create New Budget</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
                        <DialogDescription>
                            <div className="mt-5">
                                <Button
                                    size="lg"
                                    className="text-lg"
                                    variant="outline"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                                    {emoji}
                                </Button>
                                {openEmojiPicker && (
                                    <div className="absolute z-10">
                                        <EmojiPicker
                                            onEmojiClick={(e) => {
                                                setEmoji(e.emoji);
                                                setOpenEmojiPicker(false);
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="mt-4">
                                    <h2 className="text-black font-medium my-1">Budget Title</h2>
                                    <input
                                        type="text"
                                        placeholder="e.g. Home Budget"
                                        className="w-full h-[40px] text-center border rounded-md"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-black font-medium my-1">Budget Amount</h2>
                                    <input
                                        type="number"
                                        placeholder="e.g. 100"
                                        className="w-full h-[40px] text-center border rounded-md"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!name || !amount || parseFloat(amount) <= 0}
                                onClick={saveBudgetHandler}
                                className="mt-5 w-full">
                                Create Budget
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateBudgets;
