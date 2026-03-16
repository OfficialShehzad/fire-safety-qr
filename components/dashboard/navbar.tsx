"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

export function DashboardNavbar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Registration", href: "/dashboard" },
        { name: "Personnel List", href: "/dashboard/list" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <span className="text-xl font-bold tracking-tighter text-slate-900">
                            SAFETY<span className="text-slate-500">QR</span>
                        </span>

                        <div className="hidden md:flex items-center gap-4">
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

                    <div className="flex items-center gap-4">
                        <LogoutButton variant="destructive" className="h-9" />
                    </div>
                </div>
            </div>
        </nav>
    );
}