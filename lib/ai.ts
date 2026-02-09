/* eslint-disable @typescript-eslint/no-unused-vars */
export interface AIPromptResponse {
    success: boolean;
    data?: {
        imageUrl: string;
        caption: string;
        hashtags: string[];
    };
    error?: string;
}

export async function generateMemeFromPrompt(_prompt: string): Promise<AIPromptResponse> {
    // Mock AI delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
        success: true,
        data: {
            imageUrl: "https://images.unsplash.com/photo-1531297425971-ec5311e4d9b2?w=800&auto=format&fit=crop&q=60",
            caption: `POV: When you ask AI to fix your bug and it introduces 3 more.`,
            hashtags: ["#coding", "#ai", "#developer"],
        },
    };
}

export async function suggestCaptions(_imageUrl: string): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
        "When the code compiles on the first try",
        "Me explaining to my PM why it takes 3 days to change a button color",
        "Junior dev deploying to production on Friday",
        "My face when I see the legacy code"
    ];
}
