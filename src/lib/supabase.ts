import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Only create client if configured, otherwise create a mock
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// Database types
export interface Church {
  id: string;
  name: string;
  slug: string;
  contact_email: string;
  notion_page_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ChurchUser {
  id: string;
  church_id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  church?: Church;
}

export interface Sermon {
  id: string;
  church_id: string;
  title: string;
  speaker_name: string;
  sermon_date: string;
  youtube_url: string;
  series_name?: string;
  created_at: string;
  updated_at: string;
  sermon_content?: SermonContent;
}

export interface SermonContent {
  id: string;
  sermon_id: string;
  full_blog_post?: string;
  meta_tags?: string;
  video_schema_json?: any;
  social_captions?: string;
  discussion_questions?: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}