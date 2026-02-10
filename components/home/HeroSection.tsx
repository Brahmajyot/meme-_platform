"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

const CATEGORIES = [
    "All",
    "Gaming",
    "Music",
    "Live",
    "Mixes",
    "Reaction",
    "Cryptocurrency",
    "AI",
    "Tech",
    "Recently Uploaded",
    "New to you",
    "Comedy",
    "Education",
    "Sports"
];

export function HeroSection() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    return (
        <div className="sticky top-16 z-20 bg-zinc-950/95 backdrop-blur-md border-b border-white/5 w-full">
            <div className="flex items-center gap-3 px-4 py-3 overflow-x-auto no-scrollbar mask-gradient-right">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        suppressHydrationWarning
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                            selectedCategory === category
                                ? "bg-white text-black"
                                : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}
