"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "ghost" | "glass";
    icon?: ReactNode;
    disabled?: boolean;
}

export function AnimatedButton({
    children,
    className,
    onClick,
    variant = "primary",
    icon,
    disabled
}: AnimatedButtonProps) {
    const variants = {
        primary: "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/20 border-none",
        secondary: "bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700",
        ghost: "bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50",
        glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10"
    };

    return (
        <motion.button
            suppressHydrationWarning
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            className={cn(
                "relative px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300",
                variants[variant],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {icon && <span className="text-lg">{icon}</span>}
            {children}
            {variant === "primary" && (
                <div className="absolute inset-0 rounded-xl bg-white/20 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
        </motion.button>
    );
}
