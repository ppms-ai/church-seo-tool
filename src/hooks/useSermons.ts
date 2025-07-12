import { useState, useEffect } from 'react';
import { supabase, Sermon, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const { churchUser } = useAuth();

  useEffect(() => {
    if (churchUser?.church_id) {
      fetchSermons();
    }
  }, [churchUser]);

  const fetchSermons = async () => {
    if (!isSupabaseConfigured || !churchUser?.church_id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sermons')
        .select(`
          *,
          sermon_content(*)
        `)
        .eq('church_id', churchUser.church_id)
        .order('sermon_date', { ascending: false });

      if (error) throw error;
      setSermons(data || []);
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSermon = async (sermonData: {
    title: string;
    speaker_name: string;
    sermon_date: string;
    youtube_url: string;
    series_name?: string;
  }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }
    if (!churchUser?.church_id) throw new Error('No church selected');

    const { data, error } = await supabase
      .from('sermons')
      .insert({
        ...sermonData,
        church_id: churchUser.church_id,
      })
      .select()
      .single();

    if (error) throw error;

    // Create initial sermon content record
    await supabase
      .from('sermon_content')
      .insert({
        sermon_id: data.id,
        processing_status: 'pending',
      });

    await fetchSermons();
    return data;
  };

  const updateSermon = async (id: string, updates: Partial<Sermon>) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('sermons')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await fetchSermons();
  };

  const deleteSermon = async (id: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('sermons')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchSermons();
  };

  return {
    sermons,
    loading,
    createSermon,
    updateSermon,
    deleteSermon,
    refetch: fetchSermons,
  };
}