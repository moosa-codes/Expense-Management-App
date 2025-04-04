'use client';

import DashboardNavbar from "@/app/(routes)/dashboard/_components/Dashboard-navbar";
import Sidebar from "@/app/(routes)/dashboard/_components/Sidebar";
import { ReactNode, useEffect } from "react";
import { db } from "../../../../utils/dbConfig";
import { Budgets } from "../../../../utils/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {

    const { user } = useUser();
    const route = useRouter();

    useEffect(() => {
        checkUserBudgets();
    }, [user])


    const checkUserBudgets = async () => {

        const email = user?.primaryEmailAddress?.emailAddress;

        if (email) {
            const result = await db.select()
                .from(Budgets)
                .where(eq(Budgets.createdBy, email));
            if (result.length === 0) {
                route.push('/dashboard/budgets');
            }

        }
    }

    return (
        <div>
            <div className="fixed md:w-64 hidden md:block">
                <Sidebar />
            </div>
            <div className="md:ml-64 mr-10 ">
                <DashboardNavbar />
                {children}
            </div>
        </div>
    )
}

