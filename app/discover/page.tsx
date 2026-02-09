import { MemeGrid } from "@/components/meme/MemeGrid";
import { Search } from "lucide-react";

export default function DiscoverPage() {
    const CATEGORIES = ["All", "Trending", "Tech", "Animals", "Gaming", "Politics", "Reactions"];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <h1 className="text-3xl font-bold">Discover</h1>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                    {CATEGORIES.map((cat, i) => (
                        <button
                            key={cat}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <MemeGrid />
        </div>
    );
}
