export interface MemeTemplate {
    id: string;
    name: string;
    url: string;
    width: number;
    height: number;
}

export const POPULAR_TEMPLATES: MemeTemplate[] = [
    { id: "1", name: "Drake Hotline Bling", url: "/templates/drake.jpg", width: 1200, height: 1200 },
    { id: "2", name: "Distracted Boyfriend", url: "/templates/distracted.jpg", width: 1200, height: 800 },
    { id: "3", name: "Two Buttons", url: "/templates/buttons.jpg", width: 600, height: 900 },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function applyTextOverlay(canvas: HTMLCanvasElement, _text: string, _options: unknown) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Implementation for text rendering would go here
    // managing fonts, strokes, positioning, etc.
}
