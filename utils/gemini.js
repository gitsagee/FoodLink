import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
// import { raw } from "express";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function generateFoodDetails(name) {
  const prompt = `
You are an AI food detail generator for a DONATION system.
User only provides:
- Food name: ${name}

You must respond ONLY in JSON with these fields:

{
  "description": "...",
  "type": "...",
  "quantity": "...",
  "expiryDate": "...",
  "price": ...
}

Rules:
- Price MUST be between 5 and 50 rupees.since its for donation
- ExpiryDate must be realistic (e.g., "2025-11-20").
- Keep description short (max 2 lines).
- Type must be one word from: ["fruits","vegetables","grains","dairy","nonveg","prepared"].
- Quantity should be a number (like 1 plate, 5 pcs, 250g, etc.)
- today date is ${new Date().toISOString().split("T")[0]}
-expect the expiry acc to food item 

  Respond ONLY with JSON. No extra text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let raw = response.text?.trim() || "";

    console.log("RAW AI OUTPUT:", raw);

    // 1. Remove ```json or ``` blocks
    raw = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // 2. Extract the JSON object if extra text exists
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return JSON");
    }

    const cleaned = jsonMatch[0];

    console.log("CLEANED JSON STRING:", cleaned);

  
    const json = JSON.parse(cleaned);
    console.log("PARSED JSON:", json);

    return json;

  } catch (err) {
    console.log(raw);
    console.error("Gemini food generation failed:", err);
    throw new Error("AI processing failed");
  }
}
