"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedHeadline({ text, className }: { text: string; className?: string }) {
    const words = text.split(" ");

    return (
        <h1 className={cn("text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight", className)}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: [0.2, 0.65, 0.3, 0.9],
                    }}
                    className="inline-block mr-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                >
                    {word}
                </motion.span>
            ))}
        </h1>
    );
}
