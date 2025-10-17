import { GoogleGenAI, Type } from "@google/genai";
import { Tone } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSuggestions = async (
  text: string,
  tone: Tone,
  writingStyle: string | null
): Promise<string[]> => {
  if (!text.trim()) {
    return [];
  }

  try {
    const model = 'gemini-2.5-flash';

    let systemInstruction = `You are an AI assistant for a person with aphasia, integrated into a keyboard. Your primary goal is to decipher fragmented or incomplete text and transform it into complete, coherent sentences.
1.  **Analyze and Decipher**: First, understand the user's core intent from their text, even if it's abbreviated, misspelled, or unconventional.
2.  **Generate Complete Sentences**: Create 3 to 5 complete, natural-sounding sentence suggestions based on that intent.
3.  **Apply Tone and Style**: Adjust the suggestions to match the desired tone. If a writing style sample is provided, use it to influence the vocabulary and phrasing.
4.  **JSON Output**: You MUST ONLY return a JSON array of strings. Do not include any other text or markdown.

**Crucial Examples (Few-Shot Learning):**

**Example 1:**
- User input: "wanna wfh not well"
- Deciphered Intent: The user wants to work from home because they are not feeling well.
- Your output (for a 'Formal' tone): ["I would like to request to work from home today as I'm not feeling well.", "I'm not feeling well and would like to work from home.", "Could I please work from home today? I'm feeling unwell."]

**Example 2:**
- User input: "sry went dubai no reply"
- Deciphered Intent: The user is apologizing for not replying because they were on a trip to Dubai.
- Your output (for a 'Friendly' tone): ["Hey, sorry for the late reply! I was on a trip to Dubai and just got back.", "So sorry I didn't get back to you sooner, I was in Dubai.", "Apologies for the silence, I was traveling in Dubai."]

**Example 3:**
- User input: "already request regularisation pls approve"
- Deciphered Intent: The user is following up on a previously submitted request for regularization and is asking for its approval.
- Your output (for a 'Corporate' tone): ["Following up on my previous request for regularization. Could you please approve it when you have a moment?", "This is a reminder regarding my regularization request. Please let me know if you need any further information for the approval.", "Just checking in on the status of my regularization request. Your approval would be greatly appreciated."]
`;

    if (writingStyle) {
      systemInstruction += `\n\n**User's Writing Style Sample (use this for phrasing):**\n---\n${writingStyle}\n---`;
    }
    
    const contents = `Current text: "${text}"\nDesired tone: ${tone}`;

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A complete sentence suggestion to help the user communicate.",
          }
        },
        temperature: 0.4, 
      },
    });

    const responseText = response.text;
    const suggestions = JSON.parse(responseText);
    
    if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'string')) {
      return suggestions;
    }

    console.warn("Received non-array or invalid data from API:", suggestions);
    return [];
  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    throw new Error("Failed to get suggestions. Please try again.");
  }
};