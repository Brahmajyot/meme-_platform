"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Image as ImageIcon, Download, Share2, Wand2, Plus } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { generateMemeFromPrompt, suggestCaptions } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { useMemes } from "@/components/providers/MemeProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function MemeEditor() {
    const { addMeme } = useMemes();
    const { data: session } = useSession();
    const router = useRouter();

    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedMeme, setGeneratedMeme] = useState<{ url: string; caption: string } | null>(null);
    const [captions, setCaptions] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setGeneratedMeme(null);
        setCaptions([]);

        try {
            // 1. Generate Image from Prompt
            const result = await generateMemeFromPrompt(prompt);
            if (result.success && result.data) {
                setGeneratedMeme({
                    url: result.data.imageUrl,
                    caption: result.data.caption
                });

                // 2. Get Suggestions
                const suggested = await suggestCaptions(result.data.imageUrl);
                setCaptions(suggested);
            }
        } catch (error) {
            console.error("AI Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePost = () => {
        if (!generatedMeme) return;

        const newMeme = {
            id: Date.now().toString(),
            title: generatedMeme.caption,
            category: "AI Generated",
            thumbnail: generatedMeme.url,
            creator: {
                name: session?.user?.name || "Anonymous Creator",
                avatar: session?.user?.image || "https://i.pravatar.cc/150?u=anon",
            },
            views: "0",
            timePosted: "Just now",
            trendingScore: 100,
        };

        addMeme(newMeme);
        alert("Meme posted to feed!");
        router.push("/");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">
            {/* Controls Panel */}
            <div className="space-y-6">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Wand2 className="text-red-500" size={24} />
                        AI Prompt
                    </h2>
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your meme idea (e.g., 'A cat realizing it's Monday morning')..."
                            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 resize-none transition-all"
                        />
                        <div className="absolute bottom-3 right-3">
                            <AnimatedButton
                                variant="primary"
                                onClick={handleGenerate}
                                className={cn("px-4 py-2 text-sm", isGenerating && "opacity-50 cursor-not-allowed")}
                            >
                                {isGenerating ? (
                                    <>
                                        <Sparkles className="animate-spin mr-2" size={16} /> Generating...
                                    </>
                                ) : (
                                    <>
                                        Generate <Sparkles size={16} className="ml-2" />
                                    </>
                                )}
                            </AnimatedButton>
                        </div>
                    </div>
                </div>

                {/* Suggestions */}
                {captions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6"
                    >
                        <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">AI Suggestions</h3>
                        <div className="flex flex-wrap gap-2">
                            {captions.map((cap, i) => (
                                <button
                                    key={i}
                                    onClick={() => setGeneratedMeme(prev => prev ? { ...prev, caption: cap } : null)}
                                    className="text-left text-sm px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-zinc-300 hover:text-white"
                                >
                                    {cap}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Preview Panel */}
            <div className="relative bg-zinc-950 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden p-8 min-h-[400px]">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                <AnimatePresence mode="wait">
                    {isGenerating ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center space-y-4 relative z-10"
                        >
                            <div className="w-16 h-16 rounded-full border-2 border-red-500 border-t-transparent animate-spin mx-auto" />
                            <p className="text-zinc-400 animate-pulse">Consulting the meme gods...</p>
                        </motion.div>
                    ) : generatedMeme ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative z-10 w-full max-w-md bg-black rounded-sm shadow-2xl overflow-hidden group"
                        >
                            {/* This simulates a canvas/image composite */}
                            <div className="relative aspect-auto">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={generatedMeme.url} alt="Generated Meme" className="w-full object-contain" />
                                <div className="absolute top-4 left-0 right-0 text-center px-4">
                                    <p className="text-white text-2xl font-black uppercase text-stroke-black tracking-wide" style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
                                        {generatedMeme.caption}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Actions overlay */}
                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-white text-black rounded-full hover:bg-zinc-200" onClick={() => alert("Downloaded!")}>
                                    <Download size={18} />
                                </button>
                                <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600" onClick={handlePost} title="Post to Feed">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-zinc-600 space-y-2"
                        >
                            <ImageIcon size={48} className="mx-auto opacity-20" />
                            <p>Enter a prompt to start creating</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
