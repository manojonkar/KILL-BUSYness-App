import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

type ResponseData = {
  success?: boolean;
  message?: string;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, action } = req.body;

  if (!userId || !action) {
    return res.status(400).json({ error: 'Missing userId or action' });
  }

  // Validate action type
  const validActions = ['daily_access', 'module_completion', 'sharing'];
  if (!validActions.includes(action)) {
    return res.status(400).json({ error: 'Invalid action type' });
  }

  try {
    // We call the Postgres function `award_credits` to handle the logic atomically
    const { data, error } = await supabase.rpc('award_credits', {
      p_user_id: userId,
      p_action: action
    });

    if (error) {
      console.error('Error awarding credits:', error);
      return res.status(500).json({ error: error.message });
    }

    if (data && data.success === false) {
      return res.status(400).json({ error: data.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Credits awarded successfully',
      data: data
    });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
