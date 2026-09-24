import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export interface ModuleItem {
  id: string;
  chapter: number;
  title: string;
  content: string | null;
  audio_url: string | null;
  phase: string | null;
  created_at: string;
  updated_at: string;
}

export type ModulesApiResponse = {
  success: boolean;
  modules?: ModuleItem[];
  data?: ModuleItem[];
  count?: number;
  error?: string;
};

/**
 * GET /api/modules
 * Fetches available modules from Supabase, ordered by chapter.
 * Supports optional ?phase= query parameter to filter by ROAR phase (case-insensitive).
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ModulesApiResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed'
    });
  }

  try {
    const { phase } = req.query;

    // Build the query to select modules
    let query = supabase
      .from('modules')
      .select('id, chapter, title, content, audio_url, phase, created_at, updated_at')
      .order('chapter', { ascending: true })
      .order('created_at', { ascending: true });

    // Handle optional ?phase= query parameter
    if (phase) {
      const phaseParam = Array.isArray(phase) ? phase[0] : phase;
      const trimmedPhase = phaseParam?.trim();

      if (trimmedPhase) {
        // Sanitize wildcard characters for ILIKE pattern matching
        const sanitizedPhase = trimmedPhase.replace(/[%_\\]/g, '\\$&');
        query = query.ilike('phase', sanitizedPhase);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching modules from Supabase:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch modules from database'
      });
    }

    const modules = (data as ModuleItem[]) || [];

    return res.status(200).json({
      success: true,
      modules,
      data: modules,
      count: modules.length
    });
  } catch (err: any) {
    console.error('Unexpected error in /api/modules:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error'
    });
  }
}
