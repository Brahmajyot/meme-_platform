"use client";

import { BarChart, TrendingUp, Users, Eye, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
    const stats = [
        { label: "Total Views", value: "2.4M", change: "+12%", icon: Eye, positive: true },
        { label: "Engagement", value: "15.2%", change: "+4%", icon: TrendingUp, positive: true },
        { label: "Followers", value: "48.5K", change: "-0.5%", icon: Users, positive: false },
        { label: "Revenue", value: "$1,240", change: "+22%", icon: BarChart, positive: true },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Creator Analytics</h1>
                <div className="flex gap-2">
                    <select className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1 text-sm text-zinc-400">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>All Time</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-white/5 rounded-lg text-zinc-400">
                                <stat.icon size={20} />
                            </div>
                            <span className={`flex items-center text-xs font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.positive ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-zinc-500 text-sm mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Area (Mock) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-2xl p-6 min-h-[400px]">
                    <h3 className="text-lg font-bold mb-6">Audience Growth</h3>
                    <div className="flex items-end justify-between h-64 gap-2">
                        {/* Mock Bar Chart */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-zinc-800 rounded-t-sm hover:bg-red-500/80 transition-all duration-300 relative group"
                                style={{ height: `${20 + Math.random() * 60}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                                    {Math.floor(Math.random() * 1000)} views
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-zinc-500 px-2">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6">Top Content</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={`https://images.unsplash.com/photo-${i === 0 ? '1587620962725-abab7fe55159' : i === 1 ? '1517694712202-14dd9538aa97' : '1542831371-29b0f74f9713'}?w=200`} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate text-zinc-200 group-hover:text-white">Programming Humor #{i + 1}</p>
                                    <p className="text-xs text-zinc-500 mt-1">245k views • 98% likes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <h4 className="text-sm font-medium mb-3">AI Insights</h4>
                        <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-4">
                            <p className="text-xs text-red-200 mb-2 font-semibold flex items-center gap-2">
                                <TrendingUp size={12} /> Viral Opportunity
                            </p>
                            <p className="text-sm text-zinc-400">Short format videos about "Debugging" are trending up 40% this week.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
