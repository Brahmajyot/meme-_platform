"use client";

import { useEffect, useState, useRef } from "react";
import { useMemes, Meme } from "@/components/providers/MemeProvider";
import { MemeGrid } from "@/components/meme/MemeGrid";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Download, Heart, Share2, Play, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface MemeViewProps {
    id: string;
}

export function MemeView({ id }: MemeViewProps) {
    const { memes, likeMeme, viewMeme } = useMemes();
    const [meme, setMeme] = useState<Meme | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVideoError, setIsVideoError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();

    // Sync local state when memes change (e.g. likes/views update)
    useEffect(() => {
        const foundMeme = memes.find((m) => m.id === id);
        if (foundMeme) {
            setMeme(foundMeme);
        }
    }, [id, memes]);

    // Increment view count Once per mount/ID change
    const hasViewedRef = useRef(false);
    useEffect(() => {
        if (!hasViewedRef.current) {
            viewMeme(id);
            hasViewedRef.current = true;
        }
    }, [id, viewMeme]);

    const handleDownload = async () => {
        if (!meme) return;

        const url = meme.videoUrl || meme.thumbnail;
        const filename = `${meme.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${meme.videoUrl ? 'mp4' : 'jpg'}`;

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback for cross-origin or simple open
            window.open(url, '_blank');
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    if (!meme) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500">
                <p>Meme not found or loading...</p>
                <Link href="/" className="mt-4 text-red-500 hover:underline">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Player / Image Viewer */}
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                        {meme.videoUrl && !isVideoError ? (
                            <>
                                <video
                                    ref={videoRef}
                                    src={meme.videoUrl}
                                    className="w-full h-full object-contain"
                                    onClick={togglePlay}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    controls={false} // Custom controls or default? Let's use custom click-to-play for cinematic feel, but standard controls available if needed.
                                    playsInline
                                    autoPlay // Auto play on enter
                                    onError={(e) => {
                                        console.warn(`Failed to load video for meme ${id}:`, meme.videoUrl);
                                        setIsVideoError(true);
                                        setIsPlaying(false);
                                    }}
                                />
                                {!isPlaying && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                                        onClick={togglePlay}
                                    >
                                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl hover:scale-110 transition-transform">
                                            <Play className="fill-white text-white ml-2" size={32} />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={meme.thumbnail} alt={meme.title} className="w-full h-full object-contain" />
                        )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">{meme.title}</h1>
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={meme.creator.avatar} alt={meme.creator.name} className="w-6 h-6 rounded-full" />
                                        <span className="text-white font-medium">{meme.creator.name}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{meme.views} views</span>
                                    <span>•</span>
                                    <span>{meme.timePosted}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => likeMeme(meme.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                                        meme.isLiked ? "bg-red-500/20 text-red-500" : "bg-white/5 text-white hover:bg-white/10"
                                    )}
                                >
                                    <Heart size={20} className={cn(meme.isLiked && "fill-current")} />
                                    {meme.isLiked ? "Liked" : "Like"}
                                </button>

                                <AnimatedButton
                                    variant="primary"
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-6"
                                >
                                    <Download size={18} /> Download
                                </AnimatedButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Suggestions */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Up Next</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {/* We reuse MemeGrid concepts properly or map manually for a sidebar layout. 
                            For now, let's filter the current one out and show a vertical list using a simplified card view or just MemeCards.
                            MemeCard is responsive, so we can just stack them.
                        */}
                        {memes.filter(m => m.id !== id).slice(0, 5).map((m, idx) => (
                            <div key={m.id} className="scale-90 origin-top-left">
                                {/* Using a wrapper to scale down the card slightly for sidebar feeling without creating new component yet */}
                                {/* Actually, standard MemeCard might be too big. Let's create a mini-row manually here for "Next" feel */}
                                <Link
                                    href={`/meme/${m.id}`}
                                    className="flex gap-3 group p-2 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <div className="relative w-32 aspect-video bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/60 rounded text-[10px] text-white">
                                            {m.duration || "IMG"}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4 className="text-white font-medium text-sm line-clamp-2 mb-1 group-hover:text-red-400 transition-colors">{m.title}</h4>
                                        <p className="text-xs text-zinc-500">{m.creator.name}</p>
                                        <p className="text-xs text-zinc-600 mt-1">{m.views} views</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
