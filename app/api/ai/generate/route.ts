import { NextRequest, NextResponse } from "next/server";
import { generateText, analyzeImage } from "@/lib/google-ai";

export async function POST(req: NextRequest) {
    try {
        const { prompt, imageBase64 } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        let result;
        if (imageBase64) {
            result = await analyzeImage(imageBase64, prompt);
        } else {
            result = await generateText(prompt);
        }

        return NextResponse.json({ result });
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
