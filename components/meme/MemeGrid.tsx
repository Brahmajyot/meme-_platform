"use client";

import { MemeCard } from "./MemeCard";
import { useMemes } from "@/components/providers/MemeProvider";

export function MemeGrid() {
    const { memes } = useMemes();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
            {memes.map((meme, idx) => (
                <MemeCard key={meme.id} index={idx} {...meme} />
            ))}
        </div>
    );
}
