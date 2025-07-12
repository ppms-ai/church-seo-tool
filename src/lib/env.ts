export const env = {
  n8nWebhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
};

if (!env.n8nWebhookUrl) {
  console.warn('VITE_N8N_WEBHOOK_URL is not defined');
}
if (!env.supabaseUrl || !env.supabaseAnonKey) {
  console.warn('Supabase environment variables are not fully configured');
}
