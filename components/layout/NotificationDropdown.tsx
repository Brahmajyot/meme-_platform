"use client";

import { Bell, Check } from "lucide-react";
import { useMemes } from "@/components/providers/MemeProvider";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead } = useMemes();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-zinc-400 hover:text-white transition-colors relative hover:bg-white/5 rounded-full"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black animate-pulse" />
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] bg-zinc-950 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500 text-sm">
                                    <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                    No notifications yet
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                "p-3 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 items-start",
                                                !notif.is_read && "bg-white/[0.02]"
                                            )}
                                            onClick={() => markAsRead(notif.id)}
                                        >
                                            <div className="mt-1">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm text-zinc-300 leading-snug">
                                                    {notif.content}
                                                </p>
                                                <p className="text-[10px] text-zinc-500">
                                                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!notif.is_read && (
                                                <div className="mt-1">
                                                    <Check size={14} className="text-blue-500" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
