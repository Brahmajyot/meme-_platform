import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Providers } from "@/components/providers/Providers";
import { MobileNav } from "@/components/layout/MobileNav";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Download Trending Memes, Videos & GIFs for Free | MemeStream AI",
  description: "The #1 portal for memes download in India. Get thousands of copyright-free meme videos, viral GIFs, and editable meme templates for YouTube, Instagram, and WhatsApp. No login required!",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background text-foreground overflow-x-hidden max-w-[100vw]`}>
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative pb-16 lg:pb-0 w-full max-w-full overflow-x-hidden">
              <Suspense fallback={<div className="h-16 bg-zinc-950" />}>
                <Topbar />
              </Suspense>
              <main className="flex-1 pt-16">
                {children}
              </main>
              <MobileNav />
            </div>
          </div>
        </Providers>
        <Toaster position="top-center" richColors />
        <SpeedInsights />
        <Script
          src="https://js.onclckmn.com/static/onclicka.js"
          data-admpid="424687"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
