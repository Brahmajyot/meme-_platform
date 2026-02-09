"use client";
import { useRef, useState } from "react";

import { motion } from "framer-motion";
import { Play, Heart, Share2, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemeCardProps {
    id: string;
    title: string;
    thumbnail: string;
    duration?: string;
    creator: {
        name: string;
        avatar: string;
    };
    views: string;
    timePosted: string;
    className?: string;
    index: number;
    viralityScore?: number;
}

import Link from "next/link";
import { useMemes } from "@/components/providers/MemeProvider";

// ... existing imports

export function MemeCard({
    id, // Ensure ID is passed and used
    title,
    thumbnail,
    duration,
    creator,
    views,
    timePosted,
    className,
    index,
    videoUrl,
    isLiked,
    viralityScore
}: MemeCardProps & { videoUrl?: string, isLiked?: boolean, viralityScore?: number }) {
    const { likeMeme, viewMeme } = useMemes(); // Get actions
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasViewed, setHasViewed] = useState(false);
    const [isVideoError, setIsVideoError] = useState(false);

    const handleMouseEnter = () => {
        if (videoRef.current && videoUrl && !isVideoError) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
            setIsPlaying(true);

            // Increment view on play (once per session/card load)
            if (!hasViewed) {
                viewMeme(id);
                setHasViewed(true);
            }
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        likeMeme(id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn("group relative", className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={`/meme/${id}`} className="block">
                {/* Thumbnail Container */}
                <div className="relative aspect-[9/16] sm:aspect-video rounded-xl overflow-hidden mb-3 bg-black">

                    {/* Video Player (if available) */}
                    {/* Video Player (if available) */}
                    {videoUrl && !isVideoError && (
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            className={cn(
                                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                                isPlaying ? "opacity-100 z-10" : "opacity-0 z-0"
                            )}
                            muted
                            loop
                            playsInline
                            onError={(e) => {
                                console.warn(`Failed to load video for meme ${id}:`, videoUrl);
                                setIsVideoError(true);
                                setIsPlaying(false);
                            }}
                        />
                    )}

                    {/* Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                    />

                    {/* Gradient Overlay */}
                    {/* Gradient Overlay - Always visible on mobile for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 lg:opacity-60 lg:group-hover:opacity-40 transition-opacity z-20 pointer-events-none" />

                    {/* Play Button Overlay */}
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center transition-all duration-300 scale-90 z-30 pointer-events-none",
                        isPlaying ? "opacity-0 scale-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 group-hover:scale-100"
                    )}>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                            <Play className="fill-white text-white ml-1" size={20} />
                        </div>
                    </div>

                    {/* Duration Badge */}
                    {duration && (
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-xs font-medium text-white z-20">
                            {duration}
                        </div>
                    )}


                    {/* Virality Badge */}
                    {viralityScore !== undefined && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-purple-500/80 backdrop-blur text-[10px] font-bold text-white z-20 flex items-center gap-1 border border-purple-400/30">
                            <BrainCircuit size={10} />
                            {viralityScore}
                        </div>
                    )}

                    {/* Hover Actions */}
                    {/* Hover Actions - Always visible on touch/mobile, hover on desktop */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-0 opacity-100 lg:translate-x-10 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100 transition-all duration-300 delay-75 z-30 pointer-events-auto">
                        <button
                            onClick={handleLike}
                            className={cn(
                                "p-2 rounded-full backdrop-blur transition-colors",
                                isLiked ? "bg-red-500 text-white" : "bg-black/40 text-white hover:bg-red-500 hover:text-white"
                            )}
                        >
                            <Heart size={16} className={cn(isLiked && "fill-current")} />
                        </button>
                        <button
                            className="p-2 rounded-full bg-black/40 backdrop-blur text-white hover:bg-white/20 transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Share logic here if needed
                            }}
                        >
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Metadata */}
                <div className="flex gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={creator.avatar} alt={creator.name} className="w-8 h-8 rounded-full border border-white/10" />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm leading-tight line-clamp-2 group-hover:text-red-400 transition-colors">{title}</h3>
                        <div className="mt-1 flex items-center text-xs text-zinc-500">
                            <span>{creator.name}</span>
                            <span className="mx-1.5">•</span>
                            <span>{views} views</span>
                            <span className="mx-1.5">•</span>
                            <span>{timePosted}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
