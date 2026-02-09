import { SessionProvider } from "next-auth/react";
import { MemeProvider } from "@/components/providers/MemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <MemeProvider>
                {children}
            </MemeProvider>
        </SessionProvider>
    );
}
