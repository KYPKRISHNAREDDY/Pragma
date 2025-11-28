import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database type definitions for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          email: string;
          role: 'parent' | 'teacher';
          created_at: string;
        };
        Insert: {
          user_id?: string;
          email: string;
          role: 'parent' | 'teacher';
          created_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string;
          role?: 'parent' | 'teacher';
          created_at?: string;
        };
      };
      children: {
        Row: {
          child_id: string;
          parent_id: string;
          name: string;
          age: number;
          photo_url: string;
          sensory_settings: {
            soundTolerance: number;
            crowdComfort: number;
            preferredPace: 'slow' | 'medium' | 'fast';
            visualBrightness: number;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          child_id?: string;
          parent_id: string;
          name: string;
          age: number;
          photo_url: string;
          sensory_settings: {
            soundTolerance: number;
            crowdComfort: number;
            preferredPace: 'slow' | 'medium' | 'fast';
            visualBrightness: number;
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          child_id?: string;
          parent_id?: string;
          name?: string;
          age?: number;
          photo_url?: string;
          sensory_settings?: {
            soundTolerance: number;
            crowdComfort: number;
            preferredPace: 'slow' | 'medium' | 'fast';
            visualBrightness: number;
          };
          created_at?: string;
          updated_at?: string;
        };
      };
      characters: {
        Row: {
          character_id: string;
          child_id: string;
          name: string;
          relationship: string;
          photo_url: string;
          created_at: string;
        };
        Insert: {
          character_id?: string;
          child_id: string;
          name: string;
          relationship: string;
          photo_url: string;
          created_at?: string;
        };
        Update: {
          character_id?: string;
          child_id?: string;
          name?: string;
          relationship?: string;
          photo_url?: string;
          created_at?: string;
        };
      };
      stories: {
        Row: {
          story_id: string;
          child_id: string;
          template_id: string;
          title: string;
          description: string;
          frames: any;
          created_by: string;
          created_at: string;
          last_viewed_at: string | null;
          is_favorite: boolean;
          completion_count: number;
        };
        Insert: {
          story_id?: string;
          child_id: string;
          template_id: string;
          title: string;
          description: string;
          frames: any;
          created_by: string;
          created_at?: string;
          last_viewed_at?: string | null;
          is_favorite?: boolean;
          completion_count?: number;
        };
        Update: {
          story_id?: string;
          child_id?: string;
          template_id?: string;
          title?: string;
          description?: string;
          frames?: any;
          created_by?: string;
          created_at?: string;
          last_viewed_at?: string | null;
          is_favorite?: boolean;
          completion_count?: number;
        };
      };
      progress: {
        Row: {
          progress_id: string;
          child_id: string;
          story_id: string;
          completed_at: string;
          choices_made: any;
          time_spent: number;
          completion_rate: number;
        };
        Insert: {
          progress_id?: string;
          child_id: string;
          story_id: string;
          completed_at?: string;
          choices_made: any;
          time_spent: number;
          completion_rate: number;
        };
        Update: {
          progress_id?: string;
          child_id?: string;
          story_id?: string;
          completed_at?: string;
          choices_made?: any;
          time_spent?: number;
          completion_rate?: number;
        };
      };
      collaborations: {
        Row: {
          collaboration_id: string;
          child_id: string;
          invited_email: string;
          invited_by: string;
          role: 'viewer' | 'editor';
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
          accepted_at: string | null;
        };
        Insert: {
          collaboration_id?: string;
          child_id: string;
          invited_email: string;
          invited_by: string;
          role: 'viewer' | 'editor';
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          accepted_at?: string | null;
        };
        Update: {
          collaboration_id?: string;
          child_id?: string;
          invited_email?: string;
          invited_by?: string;
          role?: 'viewer' | 'editor';
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          accepted_at?: string | null;
        };
      };
    };
  };
}
