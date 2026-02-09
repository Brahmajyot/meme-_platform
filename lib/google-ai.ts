import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
    console.error("Missing GOOGLE_AI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateText(prompt: string) {
    if (!apiKey) throw new Error("Google AI API Key is not configured");

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating text:", error);
        throw error;
    }
}

export async function analyzeImage(imageBase64: string, prompt: string) {
    if (!apiKey) throw new Error("Google AI API Key is not configured");

    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: "image/jpeg", // Adjust if needed, or detect
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw error;
    }
}
