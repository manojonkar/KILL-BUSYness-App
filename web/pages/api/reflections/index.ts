import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { module_id, content, content_type, visibility } = req.body;

  if (!module_id || !content || !content_type || !visibility) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let user_id = null;
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) {
      user_id = user.id;
    }
  }

  const { data, error } = await supabase
    .from('reflections')
    .insert([
      {
        module_id,
        content,
        content_type,
        visibility,
        ...(user_id ? { user_id } : {})
      }
    ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, data });
}
