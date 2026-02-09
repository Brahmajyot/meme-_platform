"use client";

import { motion } from "framer-motion";
import {
    Home,
    TrendingUp,
    Heart,
    Video,
    Sparkles,
    Clapperboard,
    Repeat,
    Smile,
    Film,
    Music,
    LayoutTemplate,
    Newspaper,
    Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

    return (
        <>
            {/* Sidebar Container */}
            <motion.aside
                animate={{ x: 0 }}
                className={cn(
                    "fixed top-0 left-0 h-screen w-64 bg-zinc-950/95 backdrop-blur-xl border-r border-white/5 z-40 pt-6 px-4 hidden lg:block",
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

            {/* No Overlay needed since sidebar is desktop only */}
        </>
    );
}

function NavItem({ item, isActive, onClick }: { item: { icon: React.ElementType; label: string; href: string }, isActive: boolean, onClick?: () => void }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onClick}
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
