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
}

import { initDB, getMemesFromDB, saveMemeToDB, deleteMemeFromDB } from "@/lib/storage";

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

    // Load from DB on mount
    useEffect(() => {
        const load = async () => {
            try {
                const storedMemes = await getMemesFromDB();
                // Merge stored memes with mock memes, avoiding duplicates if any mock IDs clash (unlikely given UUIDs usually)
                // Actually, let's just prepend stored memes to mock memes
                // But wait, if we delete a mock meme (which isn't in DB), it will reappear.
                // For this prototype, let's say DB is source of truth for *user* memes. 
                // We'll keep MOCK_MEMES as a base, and add DB memes.
                // Ideally, we'd copy MOCK_MEMES to DB on first load? 
                // Let's just append DB memes to the state.
                const uniqueStored = storedMemes.filter(sm => !MOCK_MEMES.find(mm => mm.id === sm.id));
                setMemes([...uniqueStored, ...MOCK_MEMES]);
            } catch (e) {
                console.error("Failed to load memes", e);
            } finally {
                setIsLoaded(true);
            }
        };
        load();
    }, []);

    const addMeme = async (meme: Meme, file?: Blob) => {
        // Optimistic update
        setMemes((prev) => [meme, ...prev]);

        // Save to DB
        try {
            await saveMemeToDB(meme, file);
        } catch (e) {
            console.error("Failed to save meme", e);
        }
    };

    const likeMeme = (id: string) => {
        setMemes((prev) => prev.map(meme => {
            if (meme.id === id) {
                // In a real app, we'd save this state to DB too
                return { ...meme, isLiked: !meme.isLiked };
            }
            return meme;
        }));
    };

    const viewMeme = (id: string) => {
        setMemes((prev) => prev.map(meme => {
            if (meme.id === id) {
                // Update interaction state
                // In a real app, update DB
                return { ...meme, views: incrementViews(meme.views) };
            }
            return meme;
        }));
    };

    const deleteMeme = async (id: string) => {
        // Optimistic update
        setMemes((prev) => prev.filter(m => m.id !== id));

        // Delete from DB
        try {
            await deleteMemeFromDB(id);
        } catch (e) {
            console.error("Failed to delete meme", e);
        }
    };

    // Helper to mock view increment
    const incrementViews = (current: string) => {
        if (current.includes("M") || current.includes("K")) return current; // Complex parsing skipped for mock
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
