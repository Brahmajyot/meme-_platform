"use client";

import { cn } from "@/lib/utils";

export function SEOContent() {
    return (
        <section className="py-20 container mx-auto px-4 text-zinc-300 space-y-16">

            {/* Introduction */}
            <div className="max-w-4xl mx-auto text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose MemeStream AI?</h2>
                <p className="text-lg leading-relaxed text-zinc-400">
                    In the fast-paced world of digital marketing, memes are the ultimate universal language. At MemeStream AI, we simplify the search for quality content. We consistently update our database with:
                </p>
                <ul className="text-left max-w-2xl mx-auto space-y-3 list-disc list-inside text-zinc-400">
                    <li><span className="text-white font-medium">Trending meme video downloads</span> for Reels and TikTok.</li>
                    <li><span className="text-white font-medium">Viral meme templates</span> (Global, Bollywood, Cricket, and Political).</li>
                    <li><span className="text-white font-medium">Rare viral clips</span> and serious-turned-funny moments.</li>
                </ul>
                <p className="text-zinc-400">
                    Our mission is simple: providing an easy-to-use platform where you can browse, preview, and download memes in seconds without annoying registration walls.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

                {/* Copyright-Free Memes Video */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        Copyright-Free Memes Video
                    </h3>
                    <p className="text-zinc-400">
                        Searching for viral meme downloads for your next video project? Our copyright-free meme video library is a goldmine for editors and content creators.
                    </p>
                    <ul className="space-y-2 mt-2">
                        <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> <span><strong className="text-white">Commercial Use:</strong> Every video meme is royalty-free, making them safe for monetized YouTube channels and brand advertisements.</span></li>
                        <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> <span><strong className="text-white">Platform Optimized:</strong> High-definition clips ready for Instagram Reels, YouTube Shorts, and TikTok.</span></li>
                        <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> <span><strong className="text-white">Categories:</strong> From pop culture and sports to daily life relatability, find the perfect punchline for your edit.</span></li>
                    </ul>
                </div>

                {/* Viral Meme Templates */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">Viral Meme Templates</h3>
                    <p className="text-zinc-400">
                        Unlock your creativity with our blank meme templates. We offer a mix of "Evergreen Classics" and "New Wave" templates that are currently dominating the algorithm.
                    </p>
                    <ul className="space-y-2 mt-2">
                        <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> <span><strong className="text-white">Download:</strong> Choose from hundreds of high-resolution images.</span></li>
                        <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> <span><strong className="text-white">Edit:</strong> Add your own witty captions or face-swaps.</span></li>
                        <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> <span><strong className="text-white">Go Viral:</strong> Share directly to your favorite social media platforms.</span></li>
                    </ul>
                </div>

                {/* Extensive GIF Collection */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">Extensive GIF Collection</h3>
                    <p className="text-zinc-400">
                        Sometimes, a still image isn't enough. Our animated GIF collection covers every human emotion and reaction.
                    </p>
                    <ul className="space-y-2 mt-2">
                        <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> <span><strong className="text-white">Optimized for Speed:</strong> Our GIFs are compressed to load lightning-fast on WhatsApp, Twitter (X), and Discord.</span></li>
                        <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> <span><strong className="text-white">Reaction GIFs:</strong> Find the perfect "Facepalm," "Shocked," or "Laughing" clip to win any group chat.</span></li>
                    </ul>
                </div>

                {/* Meme News */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">Meme News & Viral Trends</h3>
                    <p className="text-zinc-400">
                        The meme world moves fast. What’s viral today is "cringe" tomorrow. Our Meme News section keeps you updated on:
                    </p>
                    <ul className="space-y-2 mt-2 list-disc list-inside text-zinc-400">
                        <li>The origin stories behind viral sensations.</li>
                        <li>Deep dives into "Internet Celebrities."</li>
                        <li>Analyses of emerging meme formats.</li>
                    </ul>
                </div>

            </div>

            {/* FAQ */}
            <div className="max-w-4xl mx-auto pt-10 border-t border-white/10">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h3>
                <div className="space-y-6">
                    <div className="bg-zinc-900/30 p-6 rounded-xl border border-white/5">
                        <h4 className="text-white font-medium mb-2">1. What is MemeStream AI?</h4>
                        <p className="text-zinc-400 text-sm">It is the leading free resource for trending video memes, GIFs, and editable templates for content creators.</p>
                    </div>
                    <div className="bg-zinc-900/30 p-6 rounded-xl border border-white/5">
                        <h4 className="text-white font-medium mb-2">2. Can I use these memes on YouTube without getting a strike?</h4>
                        <p className="text-zinc-400 text-sm">Yes! All content on MemeStream AI is copyright-free and safe for personal and commercial projects.</p>
                    </div>
                    <div className="bg-zinc-900/30 p-6 rounded-xl border border-white/5">
                        <h4 className="text-white font-medium mb-2">3. Is registration required for downloading?</h4>
                        <p className="text-zinc-400 text-sm">No. We offer instant downloads. Just find your meme and click "Download."</p>
                    </div>
                    <div className="bg-zinc-900/30 p-6 rounded-xl border border-white/5">
                        <h4 className="text-white font-medium mb-2">4. How often is the library updated?</h4>
                        <p className="text-zinc-400 text-sm">We update our collection daily to ensure you always have access to the latest viral trends.</p>
                    </div>
                </div>
            </div>

        </section>
    );
}
