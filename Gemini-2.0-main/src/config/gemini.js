import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// NEVER expose API keys in frontend code! Use environment variables instead.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function runchat(prompt) {
  try {
    // Check if API key is available
    if (!apiKey) {
      throw new Error("API key not found. Please set VITE_GEMINI_API_KEY in your .env file");
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const response = await result.response.text();
    console.log("Gemini response:", response);
    return response;
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    // Handle specific error cases
    if (error.message.includes("API key")) {
      return "Error: API key not configured. Please check your .env file and ensure VITE_GEMINI_API_KEY is set correctly.";
    } else if (error.message.includes("quota") || error.message.includes("rate limit")) {
      return "Error: API quota exceeded or rate limit reached. Please check your Gemini API usage limits.";
    } else if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Error: Network connection issue. Please check your internet connection and try again.";
    } else if (error.message.includes("model")) {
      return "Error: Model not available. Please check if the Gemini model is accessible.";
    } else {
      return `Error: ${error.message}. Please try again later.`;
    }
  }
}

export default runchat;
