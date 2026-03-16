"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth-service";
import { deleteCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";

interface LogoutButtonProps {
    className?: string;
    variant?: "default" | "destructive" | "outline" | "ghost" | "secondary";
}

export function LogoutButton({ className, variant = "ghost" }: LogoutButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            // 1. Sign out from Firebase
            await logoutUser();

            // 2. Remove the middleware session cookie
            deleteCookie("session");

            // 3. Force a refresh and redirect to login
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={variant}
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className={className}
        >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? "Logging out..." : "Logout"}
        </Button>
    );
}