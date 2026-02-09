"use client";

import { MemeCard } from "./MemeCard";
import { useMemes } from "@/components/providers/MemeProvider";

export function MemeGrid() {
    const { memes } = useMemes();

    if (!memes || memes.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-zinc-500">No memes found. Be the first to post!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 pb-20">
            {memes.map((meme, idx) => (
                <MemeCard key={meme.id} index={idx} {...meme} />
            ))}
        </div>
    );
}
