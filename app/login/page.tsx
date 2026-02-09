"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, RefreshCw, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mathAnswer, setMathAnswer] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Mock Math Challenge
    const [mathChallenge, setMathChallenge] = useState({ q: "8 × 5 = ?", a: 40 });

    const handleRefreshMath = () => {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        setMathChallenge({ q: `${a} × ${b} = ?`, a: a * b });
    };

    // Randomize on mount

    useEffect(() => {
        handleRefreshMath();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        // Simple verification check
        if (parseInt(mathAnswer) !== mathChallenge.a) {
            alert("Math verification failed! Please try again.");
            return;
        }

        if (!agreed) {
            alert("Please agree to the Terms & Conditions.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                console.error("Login failed:", result.error);
                alert("Invalid credentials. Try demo@example.com / password");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl: "/" });
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background Elements (Nebula/Stars) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-red-900/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl"
            >

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-widest text-red-600 mb-2" style={{ fontFamily: 'Impact, sans-serif' }}>
                        M.E.M.E.S
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        {isSignUp ? "Create an account to join the fun" : "Sign in to access your meme collection"}
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••••••"
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all pr-10"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Math Verification */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-300">Math Verification</label>
                            <button type="button" onClick={handleRefreshMath} className="text-zinc-500 hover:text-red-400 transition-colors">
                                <RefreshCw size={14} />
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 flex-1 flex items-center justify-center font-mono text-lg font-bold tracking-wider select-none text-zinc-300">
                                {mathChallenge.q}
                            </div>
                            <input
                                type="number"
                                value={mathAnswer}
                                onChange={(e) => setMathAnswer(e.target.value)}
                                placeholder="Answer"
                                className="w-24 bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-center text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Terms & Checks */}
                    <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-0.5">
                                <input type="checkbox" className="peer sr-only" checked={agreed} onChange={() => setAgreed(!agreed)} />
                                <div className={cn("w-4 h-4 border rounded transition-colors flex items-center justify-center", agreed ? "bg-red-600 border-red-600" : "border-zinc-600 group-hover:border-zinc-500")}>
                                    {agreed && <CheckSquare size={12} className="text-white" />}
                                </div>
                            </div>
                            <span className="text-sm text-zinc-400 leading-tight">
                                I agree to the <a href="#" className="text-red-500 hover:underline">Terms & Conditions</a>
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-900/80 hover:bg-red-800 text-white font-medium py-3 rounded-lg shadow-lg shadow-red-900/20 transition-all transform active:scale-95 border border-red-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Sign Up" : "Sign In")}
                    </button>

                    {/* Setup Toggle */}
                    <div className="text-center text-sm text-zinc-400">
                        <span>{isSignUp ? "Already have an account?" : "Don't have an account?"} </span>
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-red-500 hover:underline font-medium ml-1"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("google")}
                            className="flex items-center justify-center gap-2 bg-white text-black font-medium py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("facebook")}
                            className="flex items-center justify-center gap-2 bg-[#1877F2] text-white font-medium py-2.5 rounded-lg hover:bg-[#166fe5] transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
