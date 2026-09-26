import allModules from '../../../public/data/all_modules.json';

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

    const bookKnowledge = allModules.map((m: any) => 
      `Module ${m.linear_id} (Chapter: ${m.chapter}): ${m.title}\n${m.core_lesson}`
    ).join('\n\n---\n\n');

    const systemPrompt = `You are Manoj Onkar's rigorous AI Coach, exclusively trained on the book "KILL BUSYness".
Your job is to answer the user's questions strictly based on the book text provided below.

CRITICAL INSTRUCTIONS:
1. Always base your answers directly on the book's concepts, frameworks (like ROAR), and tone.
2. At the end of EVERY answer, you MUST tell the reader exactly where to find this information in the app. Format this citation EXACTLY like this:
   "Read more in Chapter: [Chapter Name] (Module [Module Number])."
3. If the user asks something outside the scope of the book, gently guide them back to KILL BUSYness principles.
4. Keep answers concise, highly impactful, and action-oriented.

--- BEGIN BOOK KNOWLEDGE BASE ---
${bookKnowledge}
--- END BOOK KNOWLEDGE BASE ---`;

    const userMessage = messages[messages.length - 1].content;

    const payload = {
      system_instruction: {
        parts: { text: systemPrompt }
      },
      contents: [{
        parts: [{ text: userMessage }]
      }]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3.8-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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
    
    // Simulate Vercel AI SDK text stream format for the frontend (0:"text")
    const jsonString = JSON.stringify(textResponse);
    const streamPayload = '0:' + jsonString + '\\n';

    return new Response(streamPayload, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error: any) {
    console.error('AI Coach Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
