import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function Hero() {
    const { user } = useUser();
    return (

        <section className="bg-gray-50">
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
                <div className="mx-auto max-w-xl text-center">
                    <h1 className="text-3xl font-extrabold sm:text-5xl">
                        Balance Your Bucks
                        <strong className="font-extrabold text-primary sm:block">Your Cash Manager Here!</strong>
                    </h1>

                    <p className="mt-4 sm:text-xl/relaxed">
                        Take control of your expenses, save effortlessly, and plan smarter for the future.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {!user &&
                            <Link
                                className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-purple-700 focus:outline-none focus:ring active:bg-primary sm:w-auto"
                                href="/sign-in"
                            >
                                Get Started
                            </Link>
                        }
                    </div>
                </div>
            </div>
            <Image
                src={'/dashboard.png'}
                alt='Dashboard'
                width={"1500"}
                height={800}
                className='mt-5 border bottom-4'
            />
        </section>
    )
}
