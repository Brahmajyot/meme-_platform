import { MemeGrid } from "@/components/meme/MemeGrid";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center gap-3">
                <div className="p-2 bg-zinc-800 rounded-lg">
                    <Heart size={24} className="text-red-500 fill-red-500" />
                </div>
                <h1 className="text-2xl font-bold">Your Favorites</h1>
            </div>

            {/* Reusing MemeGrid for efficiency, in real app this would filter for user favorites */}
            <MemeGrid />
        </div>
    );
}
