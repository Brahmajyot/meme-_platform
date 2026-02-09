"use client";

import { MemeEditor } from "@/components/ai/MemeEditor";
import { FileUploader } from "@/components/upload/FileUploader";
import { useState } from "react";
import { Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIStudioPage() {
    const [activeTab, setActiveTab] = useState<"ai" | "upload">("ai");

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                    Creation Studio
                </h1>
                <p className="text-zinc-400 text-lg mb-8">
                    Create viral content with AI or upload your own memes.
                </p>

                {/* Tabs */}
                <div className="inline-flex p-1 bg-zinc-900/80 rounded-full border border-white/10 backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab("ai")}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                            activeTab === "ai"
                                ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Sparkles size={16} />
                        AI Generator
                    </button>
                    <button
                        onClick={() => setActiveTab("upload")}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                            activeTab === "upload"
                                ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Upload size={16} />
                        Upload Media
                    </button>
                </div>
            </div>

            {activeTab === "ai" ? <MemeEditor /> : <FileUploader />}
        </div>
    );
}
