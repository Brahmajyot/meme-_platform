"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_MEMES } from "@/lib/mockData";

// Define the Meme type based on MOCK_MEMES structure
export interface Meme {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    videoUrl?: string;
    duration?: string;
    creator: {
        name: string;
        avatar: string;
    };
    views: string;
    timePosted: string;
    trendingScore: number;
    isLiked?: boolean; // New property
    viralityScore?: number;
    aiReasoning?: string;
}

import { createClient } from "@/lib/supabase/client";

// ... existing imports

interface MemeContextType {
    memes: Meme[];
    addMeme: (meme: Meme, file?: Blob) => void;
    likeMeme: (id: string) => void;
    viewMeme: (id: string) => void;
    deleteMeme: (id: string) => void;
}

const MemeContext = createContext<MemeContextType | undefined>(undefined);

export function MemeProvider({ children }: { children: React.ReactNode }) {
    // Initialize with mock data
    const [memes, setMemes] = useState<Meme[]>(MOCK_MEMES);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from Supabase on mount
    useEffect(() => {
        const supabase = createClient();
        const load = async () => {
            try {
                // Client moved out
                const { data, error } = await supabase
                    .from('memes')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Map snake_case to camelCase
                const mappedMemes: Meme[] = (data || []).map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    category: m.category,
                    thumbnail: m.thumbnail,
                    videoUrl: m.video_url,
                    duration: m.duration,
                    creator: {
                        name: m.creator_name || "Anonymous",
                        avatar: m.creator_avatar || "https://i.pravatar.cc/150?u=anon"
                    },
                    views: m.views || "0",
                    timePosted: new Date(m.created_at).toLocaleDateString(), // Simple format
                    trendingScore: m.trending_score,
                    viralityScore: m.virality_score,
                    aiReasoning: m.ai_reasoning,
                    isLiked: false
                }));

                // Combine with mock data if needed
                // We'll put Supabase memes first, then mock memes
                setMemes([...mappedMemes, ...MOCK_MEMES]);
            } catch (e) {
                console.error("Failed to load memes from Supabase", e);
                // Fallback to mock
                setMemes(MOCK_MEMES);
            } finally {
                setIsLoaded(true);
            }
        };
        load();

        // Realtime Subscription
        const channel = supabase
            .channel('memes-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'memes' },
                (payload) => {
                    const m = payload.new as any;
                    const newMeme: Meme = {
                        id: m.id,
                        title: m.title,
                        category: m.category,
                        thumbnail: m.thumbnail,
                        videoUrl: m.video_url,
                        duration: m.duration,
                        creator: {
                            name: m.creator_name || "Anonymous",
                            avatar: m.creator_avatar || "https://i.pravatar.cc/150?u=anon"
                        },
                        views: m.views || "0",
                        timePosted: "Just now",
                        trendingScore: m.trending_score,
                        viralityScore: m.virality_score,
                        aiReasoning: m.ai_reasoning,
                        isLiked: false
                    };

                    setMemes((prev) => [newMeme, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const addMeme = async (meme: Meme, file?: Blob) => {
        // Optimistic update
        setMemes((prev) => [meme, ...prev]);

        // We don't need to save to DB here because FileUploader handles the insert now.
        // OR we can handle it here. The previous pattern had saveMemeToDB here.
        // Let's keep it clean: FileUploader inserts, then calls addMeme to update state.
        // So this function just updates local state.
    };

    const likeMeme = (id: string) => {
        setMemes((prev) => prev.map(meme => {
            if (meme.id === id) {
                return { ...meme, isLiked: !meme.isLiked };
            }
            return meme;
        }));
    };

    const viewMeme = (id: string) => {
        setMemes((prev) => prev.map(meme => {
            if (meme.id === id) {
                return { ...meme, views: incrementViews(meme.views) };
            }
            return meme;
        }));
    };

    const deleteMeme = async (id: string) => {
        // Optimistic update
        setMemes((prev) => prev.filter(m => m.id !== id));
        // DB delete logic specific to Supabase would go here
    };

    // Helper to mock view increment
    const incrementViews = (current: string) => {
        if (current.includes("M") || current.includes("K")) return current;
        const val = parseInt(current.replace(/,/g, ""));
        if (!isNaN(val)) return (val + 1).toString();
        return "1";
    };


    return (
        <MemeContext.Provider value={{ memes, addMeme, likeMeme, viewMeme, deleteMeme }}>
            {children}
        </MemeContext.Provider>
    );
}

export function useMemes() {
    const context = useContext(MemeContext);
    if (context === undefined) {
        throw new Error("useMemes must be used within a MemeProvider");
    }
    return context;
}
