import { masterTrainingManual } from '../../../public/data/master_coach_training';
import { supabase } from '../../../lib/supabase';

export const config = {
  runtime: 'edge',
};

const MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.1-pro-preview',
];

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY in server configuration.' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { messages }: { messages: any[] } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid or missing messages payload.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = `You are Manoj Onkar's rigorous AI Coach, exclusively trained on the book "KILL BUSYness".
Your job is to answer the user's questions strictly based on the OD Expert Training Manual provided below.

CRITICAL INSTRUCTIONS:
1. Always base your answers directly on the book's concepts, frameworks (like ROAR), and tone.
2. You must act as a supportive OD expert. Do NOT act like a generic AI bot. Use the exact behavioral guidelines provided in the OD EXPERT TRAINING MANUAL below to frame your perspective.
3. If your answer is drawing on a specific OD concept, framework, or lesson from the text, you MUST tell the reader exactly where to find it. Format this citation EXACTLY like this at the very end of your response:
   "Read more in Chapter: [Chapter Name] (Module [Module Number])."
   WARNING: Do NOT append a citation if the question is conversational, meta (e.g., "how many chapters are there"), or if you aren't referencing a specific lesson. When you do cite, verify the exact chapter/module block. Do not hallucinate.
4. At the end of your response (before any citation), always ask an engaging, varied follow-up question to keep the conversation going (e.g., 'What else can I help you with?', 'Any other questions?', or 'How does this apply to your current team?').
5. If the user explicitly says they have no more questions, says 'no', or says goodbye, thank them for their time and you MUST append the exact string "[END_SESSION]" at the very end of your response.
6. If the user asks something outside the scope of the book, gently guide them back to KILL BUSYness principles.
7. Keep answers concise, highly impactful, and action-oriented.

--- BEGIN OD EXPERT TRAINING MANUAL ---
${masterTrainingManual}
--- END OD EXPERT TRAINING MANUAL ---`;

    const userMessage = messages[messages.length - 1]?.content || '';

    // Build sanitized Gemini contents with alternating user/model roles
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    const recentMessages = messages.slice(-6);

    for (const msg of recentMessages) {
      const role: 'user' | 'model' = msg.role === 'assistant' ? 'model' : 'user';
      const text = typeof msg.content === 'string' ? msg.content.trim() : '';
      if (!text || msg.isTemp) continue;

      if (contents.length === 0) {
        if (role === 'user') {
          contents.push({ role: 'user', parts: [{ text }] });
        }
      } else {
        const lastEntry = contents[contents.length - 1];
        if (lastEntry.role !== role) {
          contents.push({ role, parts: [{ text }] });
        } else {
          lastEntry.parts[0].text += `\n\n${text}`;
        }
      }
    }

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: userMessage || 'Hello' }] });
    }

    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      }
    };

    let textResponse = '';
    let lastError: any = null;

    // Multi-model fallback hierarchy
    for (const model of MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        const data = await response.json();

        if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          textResponse = data.candidates[0].content.parts[0].text;
          break; // Success!
        } else {
          const errMsg = data?.error?.message || `HTTP ${response.status}`;
          console.warn(`Model ${model} returned error:`, errMsg);
          lastError = new Error(`Model ${model}: ${errMsg}`);
        }
      } catch (err: any) {
        console.warn(`Model ${model} call failed:`, err.message);
        lastError = err;
      }
    }

    if (!textResponse) {
      throw lastError || new Error('Unable to contact AI Coach. Please try again.');
    }

    // Log the interaction anonymously
    let logId = null;
    try {
      const { data: logData, error: logError } = await supabase
        .from('anonymous_chat_logs')
        .insert([{ question: userMessage, response: textResponse }])
        .select()
        .single();
        
      if (logError) {
        console.error('Supabase Log Error:', logError);
      } else if (logData) {
        logId = logData.id;
      }
    } catch (dbErr) {
      console.error('Database connection failed:', dbErr);
    }
    
    return new Response(JSON.stringify({ text: textResponse, log_id: logId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('AI Coach Handler Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
