"use client";

import { Search, Bell, Upload, User, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";

export function Topbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        if (searchParams.get("focusSearch") === "true") {
            setIsSearchOpen(true);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set("q", query);
        } else {
            params.delete("q");
        }
        router.push(`/?${params.toString()}`);
        setIsSearchOpen(false); // Close on search
    };

    return (
        <header
            className={cn(
                "fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 px-2 sm:px-4 flex items-center transition-all duration-300 overflow-hidden",
                isScrolled ? "bg-zinc-950/95 backdrop-blur-md border-b border-white/5" : "bg-zinc-950"
            )}
        >
            {/* Mobile Logo (Hidden if search is open on small screens) */}
            <div className={cn("lg:hidden flex items-center flex-shrink-0", isSearchOpen && "hidden")}>
                <h1 className="text-lg sm:text-xl font-black tracking-widest text-red-600" style={{ fontFamily: 'Impact, sans-serif' }}>
                    M.E.M.E.S
                </h1>
            </div>

            {/* Mobile Search Toggle */}
            <button
                className={cn("lg:hidden p-2 text-zinc-400 flex-shrink-0 mr-auto", isSearchOpen && "hidden")}
                onClick={() => setIsSearchOpen(true)}
            >
                <Search size={20} />
            </button>


            {/* Search Bar - Visible on Desktop or when Mobile Search is Open */}
            <form
                onSubmit={handleSearch}
                className={cn(
                    "flex-1 max-w-xl mx-2 sm:mx-4 transition-all duration-200 min-w-0",
                    "hidden sm:block lg:block", // Default desktop behavior
                    isSearchOpen && "flex block absolute inset-x-0 top-2 z-50 px-2 bg-zinc-950" // Mobile open state
                )}
            >
                <div className="relative group w-full flex items-center gap-2">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search memes..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus={isSearchOpen}
                            className="w-full bg-zinc-900 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:bg-zinc-800 transition-all"
                        />
                    </div>

                    {/* Close Button for Mobile */}
                    {isSearchOpen && (
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(false)}
                            className="p-2 text-zinc-400 flex-shrink-0"
                        >
                            <LogOut size={20} className="rotate-180" /> {/* Using LogOut as back arrow substitute or X */}
                        </button>
                    )}
                </div>
            </form>


            {/* Actions */}
            <div className={cn("flex items-center gap-2 sm:gap-3 ml-auto flex-shrink-0", isSearchOpen && "hidden")}>
                <Link
                    href="/ai-studio"
                    className="p-2 text-zinc-400 hover:text-white transition-colors relative flex items-center gap-1 sm:gap-2 rounded-full hover:bg-white/5"
                    aria-label="Upload"
                >
                    <Upload size={20} />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">Upload</span>
                </Link>

                <NotificationDropdown />

                {session ? (
                    <div className="items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-white/10 flex">
                        <span className="text-xs sm:text-sm font-medium hidden md:inline truncate max-w-[100px]">{session.user?.name}</span>
                        <button onClick={() => signOut()} className="p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors hidden md:block flex-shrink-0" title="Sign Out">
                            <LogOut size={18} />
                        </button>
                        {session.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex-shrink-0" />
                        ) : (
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                <User size={16} />
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href="/login" className="flex-shrink-0">
                        <AnimatedButton variant="primary" className="py-1.5 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                            Sign In
                        </AnimatedButton>
                    </Link>
                )}
            </div>
        </header>
    );
}
