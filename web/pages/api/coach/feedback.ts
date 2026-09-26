import { supabase } from '../../../lib/supabase';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { log_id, feedback } = await req.json();

    if (!log_id || !feedback) {
      return new Response('Missing parameters', { status: 400 });
    }

    const { error } = await supabase
      .from('anonymous_chat_logs')
      .update({ feedback })
      .eq('id', log_id);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Feedback Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
