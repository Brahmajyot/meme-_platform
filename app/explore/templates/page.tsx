import { MemeGrid } from "@/components/meme/MemeGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "500+ Blank Meme Templates | Trending & Classic Viral Layouts",
    description: "Explore our massive collection of blank meme templates. Download high-resolution layouts for Indian memes, Bollywood, and international trends. Easy to edit and share!",
};

export default function TemplatesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Viral Meme Templates</h1>
            <p className="text-zinc-400 mb-8 max-w-2xl">
                Unlock your creativity with our blank meme templates. We offer a mix of "Evergreen Classics" and "New Wave" templates that are currently dominating the algorithm.
            </p>
            <MemeGrid />
        </div>
    );
}
