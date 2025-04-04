'use client';
import { useUser } from "@clerk/nextjs";

import { useRouter } from "next/navigation";
import Header from "./_components/header";
import Hero from "./_components/Hero";
import Footer from "./_components/Footer";

export default function Home() {
  const { user } = useUser(); // user context (clerk)
  const route = useRouter();  // route changer hook

  if (user) {  // validation
    route.push('/dashboard');
  }

  return (
    <div>
      <Header />
      <Hero />
      <Footer />
    </div>
  )
}