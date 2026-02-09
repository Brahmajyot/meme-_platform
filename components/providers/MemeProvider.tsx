"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
// MOCK_MEMES removed - using only real Supabase data
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

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
        id?: string; // Added ID for subscription
    };
    views: string;
    timePosted: string;
    trendingScore: number;
    isLiked?: boolean; // New property
    likesCount?: number; // New property
    viralityScore?: number;
    aiReasoning?: string;
}

// Notification Interface
export interface Notification {
    id: string;
    user_id: string;
    type: 'like' | 'comment' | 'follow' | 'system';
    content: string;
    is_read: boolean;
    created_at: string;
    metadata?: any;
    actor_avatar?: string;
}

interface MemeContextType {
    memes: Meme[];
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    addMeme: (meme: Meme, file?: Blob) => void;
    likeMeme: (id: string) => void;
    viewMeme: (id: string) => void;
    deleteMeme: (id: string) => void;
    subscribeToUser: (userId: string) => void;
    userId: string | null;
    // Pagination
    hasMore: boolean;
    isLoadingMore: boolean;
    loadMoreMemes: () => Promise<void>;
}

const MemeContext = createContext<MemeContextType | undefined>(undefined);

export function MemeProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session } = useSession();
    // Initialize with empty array - load from Supabase
    const [memes, setMemes] = useState<Meme[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const ITEMS_PER_PAGE = 20;

    // Use ref to track following list for realtime callbacks without closure staleness
    const followingRef = React.useRef<Set<string>>(new Set());

    // Load from Supabase on mount
    useEffect(() => {
        const supabase = createClient();

        const load = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUserId(user?.id || null);

                if (user) {
                    // Fetch Notifications
                    const { data: notifs } = await supabase
                        .from('notifications')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(20);

                    if (notifs) {
                        setNotifications(notifs as any);
                        setUnreadCount(notifs.filter((n: any) => !n.is_read).length);
                    }
                }

                // Fetch Memes (first page only)
                const { data, error } = await supabase
                    .from('memes')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .range(0, ITEMS_PER_PAGE - 1);

                if (error) throw error;

                // Fetch User's Likes
                let userLikes = new Set<string>();
                if (user) {
                    const { data: likesData } = await supabase
                        .from('likes')
                        .select('meme_id')
                        .eq('user_id', user.id);
                    likesData?.forEach((l: any) => userLikes.add(l.meme_id));

                    // Fetch User's Subscriptions
                    const { data: subsData } = await supabase
                        .from('subscriptions')
                        .select('publisher_id')
                        .eq('subscriber_id', user.id);
                    const subs = new Set<string>();
                    subsData?.forEach((s: any) => subs.add(s.publisher_id));
                    followingRef.current = subs;
                }

                // Fetch Total Likes per meme
                const { data: counts } = await supabase.from('likes').select('meme_id');
                const likeCounts: Record<string, number> = {};
                counts?.forEach((l: any) => {
                    likeCounts[l.meme_id] = (likeCounts[l.meme_id] || 0) + 1;
                });

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
                        avatar: m.creator_avatar || "https://i.pravatar.cc/150?u=anon",
                        id: m.user_id || "mock_creator_id"
                    },
                    views: m.views || "0",
                    timePosted: new Date(m.created_at).toLocaleDateString(),
                    trendingScore: m.trending_score,
                    viralityScore: m.virality_score,
                    aiReasoning: m.ai_reasoning,
                    isLiked: userLikes.has(m.id),
                    likesCount: likeCounts[m.id] || 0
                }));

                // Set memes with first page results
                setMemes(mappedMemes);
                // Check if there are more items to load
                setHasMore(mappedMemes.length >= ITEMS_PER_PAGE);
            } catch (e) {
                console.error("Failed to load memes from Supabase", e);
                setMemes([]);
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
                { event: '*', schema: 'public', table: 'memes' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
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
                                avatar: m.creator_avatar || "https://i.pravatar.cc/150?u=anon",
                                id: m.user_id || "mock_creator_id"
                            },
                            views: m.views || "0",
                            timePosted: "Just now",
                            trendingScore: m.trending_score,
                            viralityScore: m.virality_score,
                            aiReasoning: m.ai_reasoning,
                            isLiked: false,
                            likesCount: 0
                        };
                        // Only add if not already in state (prevent duplicates from realtime events)
                        setMemes((prev) => {
                            const exists = prev.some(meme => meme.id === newMeme.id);
                            return exists ? prev : [newMeme, ...prev];
                        });

                        // Notify only if subscribed
                        if (m.user_id && followingRef.current.has(m.user_id)) {
                            toast.success("New post from someone you follow!", {
                                description: `${newMeme.creator.name} just posted: ${m.title}`,
                                duration: 5000,
                            });
                        }
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications' },
                (payload) => {
                    const newNotif = payload.new as any;
                    // Only for current user
                    // Note: In a real app we'd verify userId inside, but we can't easily access current userId here 
                    // without a ref or reloading. However, RLS policy should prevent receiving foreign notifications if setup correctly.
                    // For now assuming RLS or client-side filter if we had the ID in a ref.
                    // We'll trust the RLS or just reload notifications. 
                    // To be safe let's just use the toast mechanism if logic matches.

                    if (userId && newNotif.user_id === userId) {
                        setNotifications(prev => [newNotif, ...prev]);
                        setUnreadCount(prev => prev + 1);
                        toast("New Notification", { description: newNotif.content });
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'likes' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const { meme_id } = payload.new as any;
                        setMemes(prev => prev.map(m =>
                            m.id === meme_id ? { ...m, likesCount: (m.likesCount || 0) + 1 } : m
                        ));
                    } else if (payload.eventType === 'DELETE') {
                        const { meme_id } = payload.old as any;
                        setMemes(prev => prev.map(m =>
                            m.id === meme_id ? { ...m, likesCount: Math.max(0, (m.likesCount || 0) - 1) } : m
                        ));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const addMeme = async (meme: Meme, file?: Blob) => {
        setMemes((prev) => {
            const exists = prev.some(m => m.id === meme.id);
            return exists ? prev : [meme, ...prev];
        });
    };

    const loadMoreMemes = async () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        const supabase = createClient();
        const nextPage = page + 1;
        const start = nextPage * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE - 1;

        try {
            const { data, error } = await supabase
                .from('memes')
                .select('*')
                .order('created_at', { ascending: false })
                .range(start, end);

            if (error) throw error;

            // Fetch user likes for new memes
            let userLikes = new Set<string>();
            if (userId) {
                const { data: likesData } = await supabase
                    .from('likes')
                    .select('meme_id')
                    .eq('user_id', userId);
                likesData?.forEach((l: any) => userLikes.add(l.meme_id));
            }

            // Fetch likes count for new memes
            const memeIds = (data || []).map((m: any) => m.id);
            const { data: counts } = await supabase
                .from('likes')
                .select('meme_id')
                .in('meme_id', memeIds);

            const likeCounts: Record<string, number> = {};
            counts?.forEach((l: any) => {
                likeCounts[l.meme_id] = (likeCounts[l.meme_id] || 0) + 1;
            });

            // Map new memes
            const newMemes: Meme[] = (data || []).map((m: any) => ({
                id: m.id,
                title: m.title,
                category: m.category,
                thumbnail: m.thumbnail,
                videoUrl: m.video_url,
                duration: m.duration,
                creator: {
                    name: m.creator_name || "Anonymous",
                    avatar: m.creator_avatar || "https://i.pravatar.cc/150?u=anon",
                    id: m.user_id || "mock_creator_id"
                },
                views: m.views || "0",
                timePosted: new Date(m.created_at).toLocaleDateString(),
                trendingScore: m.trending_score,
                viralityScore: m.virality_score,
                aiReasoning: m.ai_reasoning,
                isLiked: userLikes.has(m.id),
                likesCount: likeCounts[m.id] || 0
            }));

            // Add new memes with deduplication
            setMemes((prev) => {
                const existingIds = new Set(prev.map(m => m.id));
                const uniqueNewMemes = newMemes.filter(m => !existingIds.has(m.id));
                return [...prev, ...uniqueNewMemes];
            });

            setPage(nextPage);
            setHasMore(newMemes.length >= ITEMS_PER_PAGE);
        } catch (error) {
            console.error('Error loading more memes:', error);
            toast.error('Failed to load more memes');
        } finally {
            setIsLoadingMore(false);
        }
    };

    const markAsRead = async (id: string) => {
        const supabase = createClient();
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    };

    const likeMeme = async (id: string) => {
        if (!session?.user?.email) {
            toast.error("Please sign in to like memes!");
            router.push('/login');
            return;
        }

        const supabase = createClient();
        // Use NextAuth email as user_id since we're not using Supabase auth
        const userEmail = session.user.email;

        const meme = memes.find(m => m.id === id);
        const isLiked = meme?.isLiked;

        // Optimistic Update
        setMemes((prev) => prev.map(m => {
            if (m.id === id) {
                return {
                    ...m,
                    isLiked: !isLiked,
                    // Count update from Realtime
                };
            }
            return m;
        }));

        try {
            if (isLiked) {
                // Unlike
                const { error } = await supabase.from('likes').delete().match({ user_id: userEmail, meme_id: id });
                if (error) throw error;
            } else {
                // Like
                const { error } = await supabase.from('likes').insert({ user_id: userEmail, meme_id: id });

                // If conflict (409), the like already exists - try to delete it instead
                if (error?.code === '23505') {
                    await supabase.from('likes').delete().match({ user_id: userEmail, meme_id: id });
                } else if (error) {
                    throw error;
                } else {
                    // Create notification for the creator 
                    if (meme?.creator.id && meme.creator.id !== userEmail && !meme.creator.id.startsWith("mock")) {
                        await supabase.from('notifications').insert({
                            user_id: meme.creator.id,
                            type: 'like',
                            content: `Someone liked your meme: ${meme.title}`,
                            is_read: false
                        });
                    }
                }
            }
        } catch (err) {
            console.error('Error toggling like:', err);
            // Revert optimistic update
            setMemes((prev) => prev.map(m => {
                if (m.id === id) {
                    return {
                        ...m,
                        isLiked: !m.isLiked,
                    };
                }
                return m;
            }));
        }
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
        const supabase = createClient();

        // Optimistically remove from UI
        setMemes((prev) => prev.filter(m => m.id !== id));

        // Delete from database
        const { error } = await supabase.from('memes').delete().eq('id', id);

        if (error) {
            console.error('Error deleting meme:', error);
            toast.error("Failed to delete meme");
            // Revert if there's an error - would need to refetch
        } else {
            toast.success("Meme deleted successfully!");
        }
    };

    const subscribeToUser = async (targetUserId: string) => {
        if (!session?.user?.email) {
            toast.error("Sign in to subscribe!");
            router.push('/login');
            return;
        }

        const supabase = createClient();
        const userEmail = session.user.email;

        if (userEmail === targetUserId) {
            toast.warning("You can't subscribe to yourself!");
            return;
        }

        const { error } = await supabase.from('subscriptions').insert({
            subscriber_id: userEmail,
            publisher_id: targetUserId
        });

        if (error) {
            if (error.code === '23505') {
                toast.info("Already subscribed!", { description: "You are already following this creator." });
            } else {
                toast.error("Failed to subscribe");
            }
        } else {
            toast.success("Subscribed!", { description: "You will now get notifications from this creator." });
            followingRef.current.add(targetUserId);

            // Notify the creator
            if (!targetUserId.startsWith("mock")) {
                await supabase.from('notifications').insert({
                    user_id: targetUserId,
                    type: 'follow',
                    content: `New subscriber!`,
                    is_read: false
                });
            }
        }
    };

    const incrementViews = (current: string) => {
        // Handle undefined, null, or non-string values
        if (!current || typeof current !== 'string') return "1";

        // Don't increment if already formatted with M or K
        if (current.includes("M") || current.includes("K")) return current;

        const val = parseInt(current.replace(/,/g, ""));
        if (!isNaN(val)) return (val + 1).toString();
        return "1";
    };

    return (
        <MemeContext.Provider value={{
            memes,
            notifications,
            unreadCount,
            markAsRead,
            addMeme,
            likeMeme,
            viewMeme,
            deleteMeme,
            subscribeToUser,
            userId,
            hasMore,
            isLoadingMore,
            loadMoreMemes
        }}>
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
