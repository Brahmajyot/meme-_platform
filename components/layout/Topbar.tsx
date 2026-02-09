"use client";

import { Search, Bell, Upload, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Topbar() {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 px-6 flex items-center justify-between transition-all duration-300",
                isScrolled ? "bg-zinc-950/95 backdrop-blur-md border-b border-white/5" : "bg-zinc-950"
            )}
        >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center mr-4">
                <h1 className="text-xl font-black tracking-widest text-red-600 pl-12" style={{ fontFamily: 'Impact, sans-serif' }}>
                    M.E.M.E.S
                </h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl hidden sm:block lg:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-400 transition-colors" size={18} />
                    <input
                        suppressHydrationWarning
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:bg-zinc-900 transition-all"
                    />
                </div>
            </div>
            {/* Mobile Search Icon (optional, if we hide the full bar) */}
            <div className="sm:hidden flex-1 flex justify-end pr-2">
                <button className="p-2 text-zinc-400 hover:text-white">
                    <Search size={20} />
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-4">
                <Link
                    href="/ai-studio"
                    className="p-2 text-zinc-400 hover:text-white transition-colors relative hidden sm:flex items-center gap-2 rounded-full hover:bg-white/5"
                    aria-label="Upload"
                >
                    <Upload size={20} />
                    <span className="text-sm font-medium hidden md:inline">Upload</span>
                </Link>

                <button className="p-2 text-zinc-400 hover:text-white transition-colors relative hover:bg-white/5 rounded-full">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black" />
                </button>

                {session ? (
                    <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                        <span className="text-sm font-medium hidden sm:inline-block">{session.user?.name}</span>
                        <button onClick={() => signOut()} className="p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors" title="Sign Out">
                            <LogOut size={18} />
                        </button>
                        {session.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full border border-white/10" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <User size={16} />
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href="/login">
                        <AnimatedButton variant="primary" className="py-1.5 px-4 text-sm hidden sm:flex">
                            Sign In
                        </AnimatedButton>
                    </Link>
                )}
            </div>
        </header>
    );
}
