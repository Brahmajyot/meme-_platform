import { MemeGrid } from "@/components/meme/MemeGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Copyright-Free Meme Video Downloads for Creators | High Quality",
    description: "Looking for viral video memes for your YouTube Shorts or Reels? Download royalty-free meme clips and green screen effects for commercial use without copyright strikes.",
};

export default function VideosPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Copyright-Free Memes Video</h1>
            <p className="text-zinc-400 mb-8 max-w-2xl">
                Every video meme is royalty-free, making them safe for monetized YouTube channels and brand advertisements.
                High-definition clips ready for Instagram Reels, YouTube Shorts, and TikTok.
            </p>
            <MemeGrid />
        </div>
    );
}
