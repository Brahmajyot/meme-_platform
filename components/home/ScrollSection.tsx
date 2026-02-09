"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollSectionProps {
    children: ReactNode;
    className?: string;
}

export function ScrollSection({ children, className }: ScrollSectionProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

    return (
        <motion.section
            ref={ref}
            style={{ opacity, scale }}
            className={cn("py-20", className)}
        >
            {children}
        </motion.section>
    );
}
