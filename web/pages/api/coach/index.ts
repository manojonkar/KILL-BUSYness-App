import allModules from '../../../public/data/all_modules.json';
import { masterTrainingManual } from '../../../public/data/master_coach_training';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return new Response('Missing GEMINI_API_KEY in server configuration.', { status: 500 });
  }

  try {
    const { messages }: { messages: any[] } = await req.json();

    // We use gemini-3.5-flash-lite because it handles the massive 1M token context window flawlessly
    // and is highly resilient against Google's 503 free-tier throttling.
    const bookKnowledge = allModules.map((m: any) => 
      `Module ${m.linear_id} (Chapter: ${m.chapter}): ${m.title}\n${m.core_lesson}`
    ).join('\n\n---\n\n');

    const systemPrompt = `You are Manoj Onkar's rigorous AI Coach, exclusively trained on the book "KILL BUSYness".
Your job is to answer the user's questions strictly based on the book text provided below.

CRITICAL INSTRUCTIONS:
1. Always base your answers directly on the book's concepts, frameworks (like ROAR), and tone.
2. You must act as a supportive OD expert. Do NOT act like a generic AI bot. Use the exact behavioral guidelines provided in the OD EXPERT TRAINING MANUAL below to frame your perspective.
3. If your answer is drawing on a specific OD concept, framework, or lesson from the text, you MUST tell the reader exactly where to find it. Format this citation EXACTLY like this at the very end of your response:
   "Read more in Chapter: [Chapter Name] (Module [Module Number])."
   WARNING: Do NOT append a citation if the question is conversational, meta (e.g., "how many chapters are there"), or if you aren't referencing a specific lesson. When you do cite, verify the exact chapter/module block. Do not hallucinate.
4. At the end of your response (before any citation), always ask an engaging, varied follow-up question to keep the conversation going (e.g., 'What else can I help you with?', 'Any other questions?', or 'How does this apply to your current team?').
5. If the user explicitly says they have no more questions, says 'no', or says goodbye, thank them for their time and you MUST append the exact string `[END_SESSION]` at the very end of your response.
6. If the user asks something outside the scope of the book, gently guide them back to KILL BUSYness principles.
7. Keep answers concise, highly impactful, and action-oriented.

--- BEGIN OD EXPERT TRAINING MANUAL ---
${masterTrainingManual}
--- END OD EXPERT TRAINING MANUAL ---

--- BEGIN RAW BOOK KNOWLEDGE BASE ---
${bookKnowledge}
--- END RAW BOOK KNOWLEDGE BASE ---`;



    const userMessage = messages[messages.length - 1].content;

    const payload = {
      system_instruction: {
        parts: { text: systemPrompt }
      },
      contents: [{
        parts: [{ text: userMessage }]
      }]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data.error));
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    
    return new Response(JSON.stringify({ text: textResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('AI Coach Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
