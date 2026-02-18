
import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai && process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const generateNomineeDescription = async (name: string, category: string): Promise<string> => {
  try {
    const aiInstance = getAI();
    if (!aiInstance) {
      return "API key not configured.";
    }
    
    const response = await aiInstance.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 2-sentence formal and inspiring nomination description for "${name}" who is nominated in the "${category}" category of the Guia Londres Awards.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description.";
  }
};
