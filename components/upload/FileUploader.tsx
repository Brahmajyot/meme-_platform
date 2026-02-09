"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Film, Image as ImageIcon, CheckCircle2, Play } from "lucide-react";
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
                trendingScore: 100,
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
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Caption / Title</label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                                placeholder="Give your meme a catchy title..."
                            />
                        </div>

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
