'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { isSignedIn } = useUser();

    const route = useRouter();

    const getStartedHandler = () => {
        route.push('/sign-in');
    }

    return (
        <div className='p-5 flex justify-between items-center border shadow-sm'>
            <Image
                src={'./logo.svg'}
                alt={'Expenese Tracker'}
                height={150}
                width={150}
            />
            <div className='w-[150px] flex justify-between items-center'>
                {isSignedIn &&
                    <Button
                        onClick={() => route.push('/dashboard')}
                        variant={'outline'}
                        className='hover:bg-purple-700 hover:text-slate-100'
                    >Dashboard
                    </Button>
                }

                {isSignedIn ?
                    <UserButton /> :
                    <Button onClick={getStartedHandler}>Get Started</Button>
                }
            </div>
        </div>
    )
}

