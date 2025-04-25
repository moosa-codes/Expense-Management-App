'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { LayoutGrid, ReceiptText, ShieldCheck, Wallet} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const menuList = [
        {
            id: 1,
            title: 'Dashboard',
            icon: LayoutGrid,
            path: '/dashboard'
        },
        {
            id: 2,
            title: 'Budgets',
            icon: Wallet,
            path: '/dashboard/budgets'
        },
        {
            id: 3,
            title: 'Expenses',
            icon: ReceiptText,
            path: '/dashboard/expense'
        },
        {
            id: 4,
            title: 'Upgrade',
            icon: ShieldCheck,
            path: '/dashboard/upgrade'
        }
    ];

    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed md:relative h-screen p-5 bg-gradient-to-b from-purple-50 to-white border-r border-purple-100 z-40 
                transition-all duration-300 ease-in-out 
                ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-72'}`}
            >
                <Link href={'/'} onClick={() => setIsOpen(false)} className="block p-2">
                    <div className="flex items-center gap-3">
                        <Image
                            src={'/logo.png'}
                            alt={'Expenses Tracker'}
                            height={40}
                            width={40}
                            className='rounded-lg'
                        />
                        <span className="font-bold text-purple-800 text-lg hidden md:block">ExpenseTracker</span>
                    </div>
                </Link>

                <div className='mt-8 space-y-1'>
                    {menuList.map((menu) => (
                        <Link
                            key={menu.id}
                            href={menu.path}
                            onClick={() => setIsOpen(false)}
                        >
                            <div className={`flex gap-3 items-center p-3 rounded-lg transition-colors
                                ${location.pathname === menu.path ?
                                    'bg-purple-600 text-white' :
                                    'text-purple-700 hover:bg-purple-100'}`}
                            >
                                <menu.icon className="h-5 w-5" />
                                <span className="font-medium">{menu.title}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className='fixed bottom-5 left-5 right-5 md:left-auto md:right-auto'>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-purple-200 shadow-sm">
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "h-8 w-8"
                            }
                        }} />
                        <span className="font-medium text-purple-800 hidden md:block">Profile</span>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 shadow-lg z-50">
                <div className="flex justify-around items-center py-3">
                    {menuList.map((menu) => (
                        <Link
                            key={menu.id}
                            href={menu.path}
                            className={`flex flex-col items-center p-1 rounded-lg transition-colors
                                ${location.pathname === menu.path ?
                                    'text-purple-600' :
                                    'text-purple-400 hover:text-purple-600'}`}
                        >
                            <menu.icon size={20} className="mb-1" />
                            <span className="text-xs font-medium">{menu.title}</span>
                        </Link>
                    ))}
                    <div className="flex flex-col items-center p-1">
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "h-6 w-6"
                            }
                        }} />
                        <span className="text-xs font-medium text-purple-400 mt-1">Profile</span>
                    </div>
                </div>
            </div>
        </>
    );
}