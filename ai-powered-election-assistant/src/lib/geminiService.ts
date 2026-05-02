/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const SYSTEM_PROMPT = `You are the "AI Election Assistant", a premium, authoritative, yet approachable civic-tech guide. 
Your goal is to provide accurate, jargon-free, and neutral information about voting processes, eligibility, and civic education (e.g., explaining NOTA, EVM, registration).

Constraints:
1. Always maintain a professional, helpful, and non-partisan tone.
2. If you are unsure about a specific law or procedure, encourage the user to check their official local Election Commission website.
3. Keep responses concise and scannable (use bullet points if needed).
4. Do not express personal opinions or endorse candidates/parties.
5. Focus on the Indian electoral context but be helpful for general questions if context is missing.
6. For visual clarity, use markdown for bold text or lists.

Examples of queries you handle: 
- "What is NOTA?"
- "How do I check if I am on the voter list?"
- "What documents do I need for ID?"
- "Can I vote if I am 17 and turning 18 in two months?"`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function askElectionAssistant(query: string, history: ChatMessage[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request at the moment. Please try again or check the official election website.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The assistant is currently at capacity. Please check our FAQ or try again later.";
  }
}
