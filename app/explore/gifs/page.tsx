import { MemeGrid } from "@/components/meme/MemeGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Funny Reaction GIFs Download | Trending Animated Memes",
    description: "Find the perfect GIF for every reaction. Download lightweight, fast-loading animated memes for WhatsApp, Discord, and Twitter. Thousands of categories available.",
};

export default function GifsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Extensive GIF Collection</h1>
            <p className="text-zinc-400 mb-8 max-w-2xl">
                Sometimes, a still image isn't enough. Our animated GIF collection covers every human emotion and reaction. Optimized for speed on WhatsApp, Twitter (X), and Discord.
            </p>
            <MemeGrid />
        </div>
    );
}
