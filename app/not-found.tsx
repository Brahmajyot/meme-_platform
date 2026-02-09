import Link from "next/link";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h2 className="text-4xl font-bold mb-4 text-white">404 - Page Not Found</h2>
            <p className="text-zinc-400 mb-8 max-w-md">
                The meme you are looking for has been lost in the void (or deleted).
            </p>
            <Link href="/">
                <AnimatedButton variant="primary" className="px-6 py-2">
                    Return Home
                </AnimatedButton>
            </Link>
        </div>
    );
}
