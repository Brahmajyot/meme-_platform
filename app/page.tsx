import { HeroSection } from "@/components/home/HeroSection";
import { MemeGrid } from "@/components/meme/MemeGrid";
import { AdUnit } from "@/components/ads/AdUnit";

import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { MemeCard } from "@/components/meme/MemeCard";
import { MOCK_MEMES } from "@/lib/mockData";
import { SEOContent } from "@/components/home/SEOContent";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero */}
      <HeroSection />

      {/* Trending Section */}
      <section className="py-6 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <MemeGrid />
      </section>

      {/* Ad Placement: Homepage Leaderboard */}
      <div className="container mx-auto px-4">
        <AdUnit size="leaderboard" className="bg-zinc-900/40 border-y border-white/5 py-8" />
      </div>



      {/* Discover More */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-12">Latest Drops</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {MOCK_MEMES.slice(0, 4).map((meme, idx) => (
            <MemeCard key={meme.id} index={idx} {...meme} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <AnimatedButton variant="secondary" className="px-8">Load More</AnimatedButton>
        </div>
      </section>

      {/* SEO Content */}
      <SEOContent />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-zinc-950">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-sm">© 2026 MemeStream. built with <span className="text-red-500">JyotiDev</span></p>

        </div>
      </footer>
    </div>
  );
}
