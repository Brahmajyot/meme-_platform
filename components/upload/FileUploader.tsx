"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Film, Image as ImageIcon, CheckCircle2, Play, Sparkles, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemes } from "@/components/providers/MemeProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { createClient } from "@/lib/supabase/client";

export function FileUploader() {
    const { addMeme } = useMemes();
    const { data: session } = useSession();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<{ url: string; type: "video" | "image"; name: string } | null>(null);
    const [caption, setCaption] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<{ score: number; reasoning: string } | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (!session) {
            router.push("/login");
            return;
        }

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!session) {
            router.push("/login");
            return;
        }

        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        const url = URL.createObjectURL(file);
        if (file.type.startsWith("video/")) {
            setPreview({ url, type: "video", name: file.name });
            // Default caption to filename without extension
            setCaption(file.name.replace(/\.[^/.]+$/, ""));
        } else if (file.type.startsWith("image/")) {
            setPreview({ url, type: "image", name: file.name });
            setCaption(file.name.replace(/\.[^/.]+$/, ""));
        } else {
            alert("Please upload a valid image or video file.");
        }
    };

    const handleClear = () => {
        if (preview) {
            URL.revokeObjectURL(preview.url);
        }
        setPreview(null);
        setCaption("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };



    // ... inside component


    const convertBlobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || "");
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleGenerateCaption = async () => {
        if (!preview || preview.type !== 'image') return;
        setIsGenerating(true);
        try {
            const response = await fetch(preview.url);
            const blob = await response.blob();
            const base64 = await convertBlobToBase64(blob);

            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: "Generate a short, funny, viral caption for this meme image. Just the caption text, no quotes.",
                    imageBase64: base64
                })
            });

            const data = await res.json();
            if (data.result) setCaption(data.result.trim());
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("AI Error:", error);
            alert("Failed to generate caption: " + (error.message || "Unknown error"));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnalyzeVirality = async () => {
        if (!preview || preview.type !== 'image') return;
        setIsGenerating(true);
        try {
            const response = await fetch(preview.url);
            const blob = await response.blob();
            const base64 = await convertBlobToBase64(blob);

            const prompt = `Analyze this meme (Image + Caption: "${caption}"). 
            1. Give a virality score from 0-100.
            2. Explain why in 1 short sentence.
            Return JSON format: { "score": number, "reasoning": "string" }`;

            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    imageBase64: base64
                })
            });

            const data = await res.json();
            // Basic parsing if the AI returns markdown code blocks
            const cleanJson = data.result.replace(/```json|```/g, '').trim();
            const analysis = JSON.parse(cleanJson);
            setAiAnalysis(analysis);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("AI Analysis Error:", error);
            alert("Failed to analyze: " + (error.message || "Unknown error"));
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePost = async () => {
        if (!preview || !caption) return;
        setIsPosting(true);

        try {
            const supabase = createClient();

            // 1. Get the blob from the preview URL (since we essentially have a blob url stored in preview)
            // Or better, we should have kept the 'File' object.
            // But we only stored 'preview' state.
            // We can fetch the blob from the blob URL.
            const response = await fetch(preview.url);
            const blob = await response.blob();

            const fileExt = preview.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            // 2. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('meme-media')
                .upload(filePath, blob);

            if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('meme-media')
                .getPublicUrl(filePath);

            const newMeme = {
                id: crypto.randomUUID(), // Let's generate a UUID
                title: caption,
                category: preview.type === "video" ? "Video" : "Image",
                thumbnail: publicUrl, // For video, theoretically we need a separate thumb, but browser can often play/render the video url as thumb or we rely on autoplay.
                videoUrl: preview.type === "video" ? publicUrl : undefined,
                duration: preview.type === "video" ? "0:15" : undefined,
                creator: {
                    name: session?.user?.name || "Anonymous Creator",
                    avatar: session?.user?.image || "https://i.pravatar.cc/150?u=anon",
                },
                views: "0",
                timePosted: "Just now",
                trendingScore: aiAnalysis?.score || 50, // Use AI score if available, else default
                viralityScore: aiAnalysis?.score,
                aiReasoning: aiAnalysis?.reasoning,
                // user_id: session?.user?.email // We could add this if we update Meme type
            };

            await addMeme(newMeme as any);
            setIsPosting(false);
            router.push("/");

        } catch (error) {
            console.error("Upload failed:", error);
            setIsPosting(false);
            alert("Failed to upload. Ensure Supabase 'meme-media' bucket exists and policies are set.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto h-full flex flex-col">
            {!preview ? (
                <div
                    className={cn(
                        "flex-1 min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 transition-colors cursor-pointer",
                        isDragging ? "border-red-500 bg-red-500/5" : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                        if (!session) {
                            router.push("/login");
                            return;
                        }
                        fileInputRef.current?.click();
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                    />
                    <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
                        <Upload size={32} className="text-zinc-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Upload Media</h3>
                    <p className="text-zinc-500 text-center max-w-sm mb-6">
                        Drag & drop your funny videos or memes here, or click to browse.
                    </p>
                    <div className="flex gap-4">
                        <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400 flex items-center gap-2">
                            <Film size={14} /> MP4, WEBM
                        </span>
                        <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400 flex items-center gap-2">
                            <ImageIcon size={14} /> JPG, PNG, GIF
                        </span>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-6">
                    {/* Preview Area */}
                    <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video group">
                        <button
                            onClick={handleClear}
                            className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        {preview.type === "video" ? (
                            <video
                                src={preview.url}
                                controls
                                className="w-full h-full object-contain"
                                onError={() => alert("Could not play video. File might be corrupt or unsupported.")}
                            />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={preview.url} alt="Preview" className="w-full h-full object-contain" />
                        )}
                    </div>

                    {/* Details Form */}
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2 flex justify-between items-center">
                                <span>Caption / Title</span>
                                {preview.type === "image" && (
                                    <button
                                        onClick={handleGenerateCaption}
                                        disabled={isGenerating}
                                        className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                                    >
                                        <Sparkles size={12} />
                                        {isGenerating ? "Magic working..." : "Auto-Caption"}
                                    </button>
                                )}
                            </label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                                placeholder="Give your meme a catchy title..."
                            />
                        </div>

                        {preview.type === "image" && (
                            <div className="pt-2">
                                <button
                                    onClick={handleAnalyzeVirality}
                                    disabled={isGenerating}
                                    className="w-full py-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-300 text-sm font-medium transition-all flex items-center justify-center gap-2 group mb-2"
                                >
                                    <BrainCircuit size={16} className="group-hover:text-purple-400 transition-colors" />
                                    {aiAnalysis ? "Re-Analyze Virality" : "Predict Virality Score"}
                                </button>

                                {aiAnalysis && (
                                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mt-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                                <span className="font-bold text-purple-400">{aiAnalysis.score}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-white">Virality Score</h4>
                                                <p className="text-xs text-purple-300">AI Prediction</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-300 leading-relaxed">
                                            {aiAnalysis.reasoning}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <AnimatedButton
                                variant="primary"
                                onClick={handlePost}
                                disabled={!caption || isPosting}
                                className={cn(isPosting && "opacity-50 cursor-not-allowed")}
                            >
                                {isPosting ? "Posting..." : "Post to Feed"}
                            </AnimatedButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
