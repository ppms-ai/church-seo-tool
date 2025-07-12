import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, ChurchUser, isSupabaseConfigured } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [churchUser, setChurchUser] = useState<ChurchUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    // If Supabase is not configured, stop loading immediately
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          await fetchChurchUser(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, !!session?.user);
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchChurchUser(session.user.id);
        } else {
          setChurchUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchChurchUser = async (userId: string) => {
    if (!isSupabaseConfigured) {
      console.warn('[useAuth] Supabase not configured');
      setFetchError('Supabase configuration missing');
      setLoading(false);
      return;
    }

    try {
      setFetchError(null);
      console.log('[useAuth] fetching church user for', userId);
      const query = supabase
        .from('church_users')
        .select(`
          *,
          church:churches(*)
        `)
        .eq('user_id', userId)
        .single();

      console.log('[useAuth] executing query', query);
      console.time('[useAuth] church user query duration');
      const { data, error } = await query;
      console.timeEnd('[useAuth] church user query duration');

      if (error) {
        console.error('[useAuth] church user fetch error', error);
        setFetchError(error.message);
        setChurchUser(null);
      } else if (!data) {
        console.warn('[useAuth] church user query returned no data');
        setFetchError('No church record found for this account');
        setChurchUser(null);
      } else {
        console.log('[useAuth] church user data', data);
        setFetchError(null);
        setChurchUser(data);
      }
    } catch (error: any) {
      console.error('[useAuth] unexpected error fetching church user', error);
      console.log('[useAuth] userId during error', userId);
      setFetchError(error.message || 'Unexpected error');
      setChurchUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase not configured') };
    }

    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setChurchUser(null);
      setFetchError(null);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  return {
    user,
    churchUser,
    loading,
    fetchError,
    signIn,
    signUp,
    signOut,
  };
}