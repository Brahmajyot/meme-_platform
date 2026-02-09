import { MemeView } from "@/components/meme/MemeView";

export default async function MemePage({ params }: { params: Promise<{ id: string }> }) {
    // Await params in Next.js 15+ (if using that version patterns, though 14 also supports)
    // To be safe and compliant with latest Next.js patterns for params
    const resolvedParams = await params;

    return <MemeView id={resolvedParams.id} />;
}
