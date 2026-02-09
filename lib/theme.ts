export const theme = {
    colors: {
        background: "#0A0A0A",
        surface: "#18181b", // zinc-900
        surfaceHigh: "#27272a", // zinc-800
        primary: "#f4f4f5", // zinc-100
        secondary: "#a1a1aa", // zinc-400
        accentStart: "#ef4444", // red-500
        accentEnd: "#ec4899", // pink-500
    },
    animation: {
        transition: { type: "tween", ease: "circOut", duration: 0.4 },
        hover: { scale: 1.05, transition: { type: "spring", stiffness: 300 } },
    },
};
