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
    
    // First, try to get just the church_users record
    const { data, error } = await supabase
      .from('church_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    console.log('[useAuth] church user query result:', { data, error });

    if (error) {
      // If the error is "PGRST116" it means no rows found
      if (error.code === 'PGRST116') {
        console.warn('[useAuth] No church user record found for user:', userId);
        setFetchError('No church record found for this account');
      } else {
        console.error('[useAuth] church user fetch error:', error);
        setFetchError(error.message);
      }
      setChurchUser(null);
    } else if (!data) {
      console.warn('[useAuth] church user query returned no data');
      setFetchError('No church record found for this account');
      setChurchUser(null);
    } else {
      console.log('[useAuth] church user data found:', data);
      setFetchError(null);
      setChurchUser(data);
    }
  } catch (error: any) {
    console.error('[useAuth] unexpected error fetching church user:', error);
    setFetchError(error.message || 'Unexpected error');
    setChurchUser(null);
  } finally {
    setLoading(false);
  }
};
