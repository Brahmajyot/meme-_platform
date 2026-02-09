"use client";

import { Home, Search, PlusSquare, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export function MobileNav() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const items = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Search, label: "Explore", href: "/?focusSearch=true" }, // Redirects to home with search open
        { icon: PlusSquare, label: "Upload", href: "/upload", isPrimary: true },
        { icon: TrendingUp, label: "Trending", href: "/trending" },
        { icon: User, label: session ? "Profile" : "Sign In", href: session ? "/profile" : "/login" },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-t border-white/10 pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.isPrimary) {
                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-red-600 text-white p-3 rounded-2xl shadow-lg shadow-red-600/20 -mt-6 border-4 border-black"
                                >
                                    <Icon size={24} strokeWidth={2.5} />
                                </motion.div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-14 gap-1 transition-colors relative",
                                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-indicator"
                                    className="absolute -top-3 w-8 h-1 bg-red-500 rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
