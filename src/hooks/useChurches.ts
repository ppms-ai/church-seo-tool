import { useState, useEffect } from 'react';
import { supabase, Church, isSupabaseConfigured } from '../lib/supabase';

export function useChurches() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChurches = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('churches')
      .select('*')
      .order('name');
    if (error) {
      console.error('Error fetching churches:', error);
    }
    setChurches(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchChurches();
  }, []);

  const addChurch = async (church: Partial<Church>) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('churches').insert(church);
    if (error) throw error;
    await fetchChurches();
  };

  const updateChurch = async (id: string, updates: Partial<Church>) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('churches').update(updates).eq('id', id);
    if (error) throw error;
    await fetchChurches();
  };

  const deleteChurch = async (id: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('churches').delete().eq('id', id);
    if (error) throw error;
    await fetchChurches();
  };

  return { churches, loading, addChurch, updateChurch, deleteChurch, refetch: fetchChurches };
}
