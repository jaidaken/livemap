import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vucoqgbmlrregzajdbgc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1Y29xZ2JtbHJyZWd6YWpkYmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwOTYzNTgsImV4cCI6MjAyMzY3MjM1OH0.AqBdi07_2GbyZYR8PjgcNq3IpDo6oWm5KaWkACjDdvk';

const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchSystems = async () => {
  try {
    const { data, error } = await supabase.from('systems').select('*');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching systems:', error.message);
    throw error;
  }
};
