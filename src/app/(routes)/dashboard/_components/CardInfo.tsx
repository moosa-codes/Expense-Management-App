import { ReceiptText, WalletCards, Wallet } from 'lucide-react';
import React, { useMemo } from 'react';

interface Budget {
    id: string | number;
    name: string;
    amount: number;
    emoji: string;
    totalSpend: number;
    totalItems: number;
}

interface CardInfoProps {
    budgetList: Budget[];
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    colorVariant?: 'purple' | 'indigo' | 'fuchsia';
}

const StatCard = ({ title, value, icon, colorVariant = 'purple' }: StatCardProps) => {
    const colorClasses = {
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-100',
            shadow: 'shadow-purple-100',
            hoverShadow: 'hover:shadow-purple-200',
            text: 'text-purple-800'
        },
        indigo: {
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
            shadow: 'shadow-indigo-100',
            hoverShadow: 'hover:shadow-indigo-200',
            text: 'text-indigo-800'
        },
        fuchsia: {
            bg: 'bg-fuchsia-50',
            border: 'border-fuchsia-100',
            shadow: 'shadow-fuchsia-100',
            hoverShadow: 'hover:shadow-fuchsia-200',
            text: 'text-fuchsia-800'
        }
    };

    return (
        <div className={`p-6 border ${colorClasses[colorVariant].border} flex items-center justify-between rounded-xl w-full ${colorClasses[colorVariant].bg} shadow-md ${colorClasses[colorVariant].shadow} hover:shadow-lg ${colorClasses[colorVariant].hoverShadow} transition-all duration-300`}>
            <div>
                <h2 className={`text-sm font-medium ${colorClasses[colorVariant].text}`}>{title}</h2>
                <h2 className="font-bold text-2xl text-gray-800">{value}</h2>
            </div>
            <div className="p-2 rounded-full bg-white shadow-sm">
                {icon}
            </div>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((index) => (
            <div key={index} className="h-40 w-full bg-gradient-to-r from-purple-50 to-white rounded-xl animate-pulse" />
        ))}
    </div>
);

function CardInfo({ budgetList }: CardInfoProps) {
    const { totalBudget, totalSpend, budgetCount } = useMemo(() => {
        if (!budgetList?.length) {
            return { totalBudget: 0, totalSpend: 0, budgetCount: 0 };
        }

        return {
            totalBudget: budgetList.reduce((sum, item) => sum + Number(item.amount), 0),
            totalSpend: budgetList.reduce((sum, item) => sum + Number(item.totalSpend), 0),
            budgetCount: budgetList.length,
        };
    }, [budgetList]);

    if (!budgetList.length) {
        return <LoadingSkeleton />;
    }

    const cards = [
        {
            title: 'Total Budget',
            value: `$${totalBudget.toLocaleString()}`,
            icon: <WalletCards className="text-purple-600 h-8 w-8" />,
            colorVariant: 'purple' as const
        },
        {
            title: 'Total Spend',
            value: `$${totalSpend.toLocaleString()}`,
            icon: <ReceiptText className="text-indigo-600 h-8 w-8" />,
            colorVariant: 'indigo' as const
        },
        {
            title: 'No. of Budgets',
            value: budgetCount,
            icon: <Wallet className="text-fuchsia-600 h-8 w-8" />,
            colorVariant: 'fuchsia' as const
        },
    ];

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
                <StatCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    colorVariant={card.colorVariant}
                />
            ))}
        </div>
    );
}

export default CardInfo;