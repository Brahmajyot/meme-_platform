import { MemeGrid } from "@/components/meme/MemeGrid";
import { TrendingUp } from "lucide-react";

export default function TrendingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 p-6 bg-gradient-to-r from-red-900/20 to-pink-900/20 rounded-2xl border border-red-500/10 flex items-center gap-4">
                <div className="p-3 bg-red-500 rounded-xl text-black">
                    <TrendingUp size={32} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Trending Now</h1>
                    <p className="text-zinc-400">The most viral content across the metaverse in the last 24 hours.</p>
                </div>
            </div>
            <MemeGrid />
        </div>
    );
}
