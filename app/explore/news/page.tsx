import { Metadata } from "next";
import { AdUnit } from "@/components/ads/AdUnit";

export const metadata: Metadata = {
    title: "Meme News & Trends | The Story Behind Viral Memes",
    description: "Stay updated with the latest meme trends. Learn the origins of viral internet sensations and see what’s trending on social media right now.",
};

export default function NewsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Meme News & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Viral Trends</span></h1>
                <p className="text-zinc-400 text-lg max-w-2xl">
                    Breaking down the biggest moments on the internet right now. From Super Bowl LX to the streets of Mumbai.
                </p>

                {/* Ad Placement: Top Leaderboard */}
                <AdUnit size="leaderboard" className="mt-8 mb-4 border-t border-b border-white/5 py-4 bg-zinc-900/20" />
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Trend 1: Lonely Penguin */}
                <article className="group bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/80 transition-all hover:scale-[1.02] cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-red-500/10 text-red-500 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">India Breakout</span>
                        <span className="text-zinc-600 text-xs">2 hrs ago</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors">The Lonely Penguin</h3>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                        Why is a solitary penguin getting 50M views? The "sad but cute" aesthetic is taking over Reels and WhatsApp statuses.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 border-t border-white/5 pt-4">
                        <span className="flex items-center gap-1">🔥 98/100 Virality</span>
                        <span>•</span>
                        <span className="text-blue-400 hover:underline">Download Template</span>
                    </div>
                </article>

                {/* Ad Placement: In-Feed Rectangle (Mobile/Tablet Friendly) */}
                <div className="hidden md:flex items-center justify-center bg-zinc-900/20 rounded-2xl border border-white/5 border-dashed">
                    <AdUnit size="rectangle" />
                </div>

                {/* Trend 2: Sam Darnold */}
                <article className="group bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/80 transition-all hover:scale-[1.02] cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Super Bowl LX</span>
                        <span className="text-zinc-600 text-xs">4 hrs ago</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Legend of Sam Darnold</h3>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                        The Seahawks just won Super Bowl LX and Sam Darnold is the main character. The apology forms are trending globally.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 border-t border-white/5 pt-4">
                        <span className="flex items-center gap-1">🏈 Global Trend</span>
                        <span>•</span>
                        <span className="text-blue-400 hover:underline">View Collection</span>
                    </div>
                </article>

                {/* Trend 3: Ruko Jara Sabar Karo */}
                <article className="group bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/80 transition-all hover:scale-[1.02] cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Evergreen</span>
                        <span className="text-zinc-600 text-xs">Daily</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">"Ruko Jara Sabar Karo"</h3>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                        The Hindustani Bhau classic is seeing a massive resurgence in 2026 edits. Perfect for "Wait for it" moments.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 border-t border-white/5 pt-4">
                        <span className="flex items-center gap-1">📈 +400% Searches</span>
                        <span>•</span>
                        <span className="text-blue-400 hover:underline">Get Sound</span>
                    </div>
                </article>
            </div>
        </div>
    );
}
