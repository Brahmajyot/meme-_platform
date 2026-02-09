"use client";

import { MemeCard } from "./MemeCard";
import { useMemes } from "@/components/providers/MemeProvider";
import { CategoryTabs } from "./CategoryTabs";
import { useSearchParams } from "next/navigation";

export function MemeGrid() {
    const { memes } = useMemes();
    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const searchQuery = searchParams.get("q")?.toLowerCase();

    const filteredMemes = memes.filter(m => {
        const matchesCategory = category && category !== "all" ? m.category?.toLowerCase() === category.toLowerCase() : true;
        const matchesSearch = searchQuery
            ? (m.title.toLowerCase().includes(searchQuery) || m.category?.toLowerCase().includes(searchQuery))
            : true;
        return matchesCategory && matchesSearch;
    });

    return (
        <div>
            <CategoryTabs />

            {filteredMemes.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
                    <p className="text-zinc-400 text-lg">No memes found in this category.</p>
                    <p className="text-zinc-600 text-sm mt-2">Try switching categories or upload one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 pb-20">
                    {filteredMemes.map((meme, idx) => (
                        <MemeCard key={meme.id} index={idx} {...meme} />
                    ))}
                </div>
            )}
        </div>
    );
}
