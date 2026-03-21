"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function DashboardNavbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const navItems = [
        { name: "Registration", href: "/dashboard" },
        { name: "Personnel List", href: "/dashboard/list" },
    ];

    return (
        <>
            {/* TOP NAV */}
            <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* LEFT */}
                        <div className="flex items-center gap-4">
                            {/* MOBILE MENU BUTTON */}
                            <button
                                className="md:hidden"
                                onClick={() => setOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>

                            {/* LOGO */}
                            <Image
                                src={"/logo.png"}
                                height={20}
                                width={80}
                                alt="interio by godrej"
                            />

                            {/* DESKTOP NAV */}
                            <div className="hidden md:flex items-center gap-4 ml-6">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                                            pathname === item.href
                                                ? "bg-slate-100 text-slate-900"
                                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="hidden md:flex items-center gap-4">
                            <LogoutButton variant="destructive" className="h-9" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* MOBILE SIDENAV */}
            <div
                className={cn(
                    "fixed inset-0 z-50 transition",
                    open ? "visible" : "invisible"
                )}
            >
                {/* OVERLAY */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/40 transition-opacity",
                        open ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setOpen(false)}
                />

                {/* SIDEBAR */}
                <div
                    className={cn(
                        "absolute left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform",
                        open ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="flex items-center justify-between p-4 border-b">
                        <Image
                            src={"/logo.png"}
                            height={20}
                            width={80}
                            alt="logo"
                        />
                        <button onClick={() => setOpen(false)}>
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex flex-col p-4 gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "px-3 py-2 rounded-md text-sm font-medium",
                                    pathname === item.href
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto p-4">
                        <LogoutButton variant="destructive" className="w-full" />
                    </div>
                </div>
            </div>
        </>
    );
}