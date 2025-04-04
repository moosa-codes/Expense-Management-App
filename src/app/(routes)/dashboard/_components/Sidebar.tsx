'use client'
import React from 'react'
import Image from 'next/image'
import { LayoutGrid, ReceiptText, ShieldCheck, Wallet } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Sidebar() {

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
            title: 'Expenses', // For a specific expense
            icon: ReceiptText,
            path: `/dashboard/expense` // Replace `id` dynamically based on your use case
        },
        {
            id: 4,
            title: 'Upgrade',
            icon: ShieldCheck,
            path: '/dashboard/upgrade'
        }
    ];


    return (
        <div className='h-screen p-5 border shadow-sm '>
            <Image
                src={'/logo.svg'}
                alt="Logo"
                width={160}
                height={100}
            />
            <div className='mt-5'>
                {menuList.map((menu) => (
                    <Link
                        key={menu.id} href={menu.path}>
                        <h2
                            className={`flex gap-2 items-center text-gray-500 font-medium p-5
                     cursor-pointer rounded-md hover:text-primary hover:bg-purple-100
                        `}
                        >
                            {menu.title}
                            <menu.icon />
                        </h2>
                    </Link>
                ))}
            </div>
            <div className='fixed bottom-10 flex gap-2 items-center ml-[-10]'>
                <UserButton /> Profile
            </div>
        </div>
    );
}

