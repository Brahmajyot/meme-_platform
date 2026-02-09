"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDangerous = false
}: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            {/* Content */}
                            <div className="p-6 pt-8">
                                {/* Icon */}
                                {isDangerous && (
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                                        <AlertTriangle className="text-red-500" size={24} />
                                    </div>
                                )}

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {title}
                                </h3>

                                {/* Message */}
                                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                    {message}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <AnimatedButton
                                        variant="secondary"
                                        onClick={onClose}
                                        className="flex-1"
                                    >
                                        {cancelText}
                                    </AnimatedButton>
                                    <AnimatedButton
                                        variant={isDangerous ? "primary" : "secondary"}
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        className="flex-1"
                                    >
                                        {confirmText}
                                    </AnimatedButton>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
