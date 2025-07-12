import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, ChurchUser, isSupabaseConfigured } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [churchUser, setChurchUser] = useState<ChurchUser | null>(null);
  const [loading, setLoading] = useState(true);

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
    try {
      console.log('Fetching church user for:', userId);
      
      const { data, error } = await supabase
        .from('church_users')
        .select(`
          *,
          church:churches(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Church user fetch error:', error);
        setChurchUser(null);
      } else {
        console.log('Church user data:', data);
        setChurchUser(data);
      }
    } catch (error) {
      console.error('Error fetching church user:', error);
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
      return { error };
    } catch (error) {
      return { error };
    }
  };

  return {
    user,
    churchUser,
    loading,
    signIn,
    signUp,
    signOut,
  };
}