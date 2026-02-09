"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { ScrollSection } from "./ScrollSection";

interface FeatureSectionProps {
    title: string;
    description: string;
    align?: "left" | "right";
    children?: ReactNode;
    className?: string;
}

export function FeatureSection({ title, description, align = "left", children, className }: FeatureSectionProps) {
    return (
        <ScrollSection className={cn("min-h-[80vh] flex items-center justify-center relative overflow-hidden", className)}>
            <div className={cn(
                "container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                align === "right" && "lg:grid-flow-col-dense"
            )}>
                {/* Text Content */}
                <div className={cn("space-y-6 z-10", align === "right" && "lg:col-start-2")}>
                    <motion.h2
                        initial={{ opacity: 0, x: align === "left" ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg text-zinc-400 leading-relaxed"
                    >
                        {description}
                    </motion.p>
                </div>

                {/* Visual Content */}
                <div className={cn("relative", align === "right" && "lg:col-start-1")}>
                    {children}
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 to-pink-500/10 blur-3xl rounded-full -z-10" />
                </div>
            </div>
        </ScrollSection>
    );
}
