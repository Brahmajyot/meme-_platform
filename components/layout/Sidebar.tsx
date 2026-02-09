"use client";

import { motion } from "framer-motion";
import {
    Home,
    TrendingUp,
    Heart,
    Video,
    Sparkles,
    Menu,
    X,
    Smile,
    Film,
    // Anchor was not found, using Link2 or similar if needed, but let's stick to standard ones
    Music,
    LayoutTemplate,
    Newspaper,
    Zap,
    Clapperboard,
    Repeat
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const HOME_ITEMS = [
    { icon: Home, label: "Home", href: "/" },
    { icon: TrendingUp, label: "Trending", href: "/trending" },
    { icon: Smile, label: "Giggles", href: "/giggles" },
    { icon: Video, label: "Videos", href: "/videos" },
];

const YOU_ITEMS = [
    { icon: Heart, label: "Favorites", href: "/favorites" },
];

const EXPLORE_ITEMS = [
    { icon: Film, label: "Meme Videos", href: "/explore/videos" },
    { icon: Repeat, label: "Transitional Hooks", href: "/explore/hooks" },
    { icon: Music, label: "Sound Effects", href: "/explore/sounds" },
    { icon: LayoutTemplate, label: "Meme Template", href: "/explore/templates" },
    { icon: Newspaper, label: "Meme News", href: "/explore/news" },
    { icon: Zap, label: "Viral Gif", href: "/explore/gifs" },
    { icon: Sparkles, label: "Meme Generator", href: "/generator" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // Handle resize to reset state on desktop
    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener("resize", checkDesktop);
        return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900/80 backdrop-blur-md rounded-lg border border-white/10 text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{ x: isDesktop || isOpen ? 0 : "-100%" }}
                className={cn(
                    "fixed top-0 left-0 h-screen w-64 bg-zinc-950/95 backdrop-blur-xl border-r border-white/5 z-40 pt-6 px-4 transition-transform duration-300 ease-in-out",
                    "lg:translate-x-0 lg:w-64" // Reset for desktop
                )}
            >
                {/* Logo */}
                <div className="mb-8 px-2">
                    <h1 className="text-3xl font-black tracking-widest text-red-600" style={{ fontFamily: 'Impact, sans-serif' }}>
                        M.E.M.E.S
                    </h1>
                </div>

                <nav className="space-y-8 overflow-y-auto h-[calc(100vh-100px)] pb-10 no-scrollbar">
                    {/* Home Section */}
                    <div className="bg-zinc-900/50 rounded-xl p-2 border border-white/5">
                        <div className="space-y-1">
                            {HOME_ITEMS.map((item) => (
                                <NavItem key={item.href} item={item} isActive={pathname === item.href} />
                            ))}
                        </div>
                    </div>

                    {/* You Section */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2 px-2">You</h3>
                        <div className="space-y-1">
                            {YOU_ITEMS.map((item) => (
                                <NavItem key={item.href} item={item} isActive={pathname === item.href} />
                            ))}
                        </div>
                    </div>

                    {/* Explore Section */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2 px-2">Explore</h3>
                        <div className="space-y-1">
                            {EXPLORE_ITEMS.map((item) => (
                                <NavItem key={item.href} item={item} isActive={pathname === item.href} />
                            ))}
                        </div>
                    </div>
                </nav>

                {/* User Profile Snippet (Optional - keeping mostly hidden or minimal if needed, but user didn't explicitly ask to remove it, sticking to design which had simple nav) */}
            </motion.aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}

function NavItem({ item, isActive }: { item: { icon: React.ElementType; label: string; href: string }, isActive: boolean }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                    ? "text-white bg-zinc-800"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            )}
        >
            <Icon size={20} className={cn("relative z-10", isActive && "text-red-500")} />
            <span className="relative z-10">{item.label}</span>
        </Link>
    );
}
