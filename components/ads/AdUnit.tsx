"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AdUnitProps {
    size?: "leaderboard" | "rectangle" | "skyscraper";
    className?: string;
    variant?: "horizontal" | "vertical" | "box";
}

export function AdUnit({ size = "leaderboard", className, variant = "horizontal" }: AdUnitProps) {
    // In a real app, this would integrate with Google AdSense or another ad network
    // For now, we'll render a placeholder that looks like a real ad
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const dimensions = {
        leaderboard: "w-full h-[90px] max-w-[728px]",
        rectangle: "w-[300px] h-[250px]",
        skyscraper: "w-[160px] h-[600px]",
    };

    const sizeClass = dimensions[size];

    return (
        <div className={cn("flex flex-col items-center justify-center my-8", className)}>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 self-start ml-2 opacity-50">Advertisement</div>
            <div
                className={cn(
                    "bg-zinc-800/50 border border-white/5 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer hover:bg-zinc-800 transition-colors",
                    sizeClass
                )}
            >
                {/* Simulated Ad Content */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50" />

                <div className="z-10 text-center p-4">
                    <span className="text-zinc-500 font-mono text-xs block mb-1">Ad Space</span>
                    <span className="text-zinc-400 font-bold text-sm bg-zinc-900/80 px-3 py-1 rounded-full border border-white/10 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all">
                        Your Ad Here
                    </span>
                </div>

                {/* Simulated "Ad Choice" icon */}
                <div className="absolute top-0 right-0 p-1 bg-zinc-900/80 text-[8px] text-zinc-600 border-l border-b border-white/5">
                    ⓘ
                </div>
            </div>
        </div>
    );
}
