"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <main className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/aster-hospital.jpeg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          QR <br />
          <span className="text-slate-400">Management System</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
          Streamline personnel registration and emergency safety protocols with our integrated QR management platform.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {user ? (
            <Button asChild size="lg" className="bg-white text-black hover:bg-white hover:opacity-100 px-8 py-6 text-lg rounded-full">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="bg-white text-black hover:bg-white hover:opacity-100 px-8 py-6 text-lg rounded-full">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Subtle Bottom Branding */}
      <div className="absolute top-5 left-0 right-0 z-10 display-grid place-items-left px-8 mx-8 rounded-full bg-white/50">
        <Image src={"/logo.png"} height={20} width={80} alt="interio by godrej"/>
      </div>
    </main>
  );
}