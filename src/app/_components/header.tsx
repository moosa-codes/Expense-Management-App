'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
    const { isSignedIn } = useUser();

    const route = useRouter();

    const getStartedHandler = () => {
        route.push('/sign-in');
    }

    return (
        <div className='p-5 flex justify-between items-center border shadow-sm'>
            <Link href={'/'}>
                <Image
                    src={'/logo.png'}
                    alt={'Expenese Tracker'}
                    height={50}
                    width={50}
                    className='rounded-full cursor-pointer'
                />
            </Link>
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

