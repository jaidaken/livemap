import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const authenticateSupabase = async () => {
  try {
    const email = import.meta.env.VITE_APP_USER_EMAIL;
    const password = import.meta.env.VITE_APP_USER_PASSWORD;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw error;
  }
};
