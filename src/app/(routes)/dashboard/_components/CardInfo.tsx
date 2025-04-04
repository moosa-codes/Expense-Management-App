import { ReceiptText, WalletCards, WalletIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Budget {
    id: string | number;
    name: string;
    amount: number;
    emoji: string;
    totalSpend: number;
    totalItems: number;
}

// Props type
interface CardInfoProps {
    budgetList: Budget[];
}

function CardInfo({ budgetList }: CardInfoProps) {
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);

    useEffect(() => {
        if (budgetList?.length > 0) {
            calculateCardInfo();
        }
    }, [budgetList]);

    const calculateCardInfo = () => {
        let totalBudget_ = 0;
        let totalSpend_ = 0;

        budgetList.forEach((item) => {
            totalBudget_ += Number(item.amount);
            totalSpend_ += Number(item.totalSpend);
        });

        setTotalBudget(totalBudget_);
        setTotalSpend(totalSpend_);
    };

    return (
        <>
            {budgetList.length !== 0 ? (
                <div className="mr-[100px] mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 p-5">
                    <div className="p-7 border flex items-center justify-between rounded-lg w-[320px] shadow-xl
                    hover:shadow-lg hover:shadow-purple-300">
                        <div>
                            <h2 className="text-sm">Total Budget</h2>
                            <h2 className="font-bold text-2xl">${totalBudget.toLocaleString()}</h2>
                        </div>
                        <WalletCards className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                    </div>

                    <div className="p-7 border flex items-center justify-between rounded-lg w-[320px] shadow-purple-300 
                    shadow-lg ">
                        <div>
                            <h2 className="text-sm">Total Spend</h2>
                            <h2 className="font-bold text-2xl">${totalSpend.toLocaleString()}</h2>
                        </div>
                        <ReceiptText className="bg-primary p-3 h-12 w-12 rounded-full text-white " />
                    </div>

                    <div className="p-7 border flex items-center justify-between rounded-lg w-[320px] shadow-xl
                     hover:shadow-lg hover:shadow-purple-300">
                        <div>
                            <h2 className="text-sm">No. of Budgets</h2>
                            <h2 className="font-bold text-2xl">{budgetList.length}</h2>
                        </div>
                        <WalletIcon className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                    </div>
                </div>
            ) : (
                [1, 2, 3].map((index) => (
                    <div key={index} className="h-[160px] w-full bg-slate-200 animate-pulse rounded-lg"></div>
                ))
            )}
        </>
    );
}

export default CardInfo;
