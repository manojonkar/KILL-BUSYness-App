import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const messages = body.messages || [];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reply = "Hello! I am Manoj Onkar's AI coach. I'm currently running in a mocked streaming mode. Soon, I'll be connected to a real Knowledge Base to help you overcome busyness and focus on what truly matters!";
        const chunks = reply.split(' ');
        
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk + ' '));
          // Mock streaming delay
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
