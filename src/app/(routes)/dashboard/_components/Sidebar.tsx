'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { LayoutGrid, ReceiptText, ShieldCheck, Wallet, Menu, X } from 'lucide-react'
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
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className={`fixed md:relative h-screen p-5 border shadow-sm bg-white z-40 
                transition-all duration-300 ease-in-out 
                ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-auto'}`}
            >
                <Link href={'/'} onClick={() => setIsOpen(false)}>
                    <Image
                        src={'/logo.png'}
                        alt={'Expenses Tracker'}
                        height={50}
                        width={50}
                        className='rounded-full cursor-pointer'
                    />
                </Link>
                
                <div className='mt-5'>
                    {menuList.map((menu) => (
                        <Link
                            key={menu.id} 
                            href={menu.path}
                            onClick={() => setIsOpen(false)}
                        >
                            <h2
                                className={`flex gap-2 items-center text-gray-500 font-medium p-5
                                    cursor-pointer rounded-md hover:text-primary hover:bg-purple-100
                                `}
                            >
                                <menu.icon className="min-w-[24px]" />
                                <span className="whitespace-nowrap">{menu.title}</span>
                            </h2>
                        </Link>
                    ))}
                </div>
                
                <div className='fixed bottom-10 flex gap-2 items-center'>
                    <UserButton /> 
                    <span className="whitespace-nowrap hidden md:inline">Profile</span>
                </div>
            </div>
        </>
    );
}