"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "funny", label: "Funny" },
    { id: "tech", label: "Tech" },
    { id: "gaming", label: "Gaming" },
    { id: "music", label: "Music" },
    { id: "educational", label: "Educational" },
    { id: "dark", label: "Dark" }, // User mentioned "Dark" luxury, might use "Dark Humor"? Keeping simple.
];

export function CategoryTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "all";

    const handleCategoryClick = (categoryId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryId === "all") {
            params.delete("category");
        } else {
            params.set("category", categoryId);
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
            {CATEGORIES.map((category) => (
                <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    suppressHydrationWarning
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                        currentCategory === category.id
                            ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                            : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                    )}
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
}
