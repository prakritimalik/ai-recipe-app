import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database helper functions
export const db = {
  // Saved recipes
  recipes: {
    async getByUser(userId) {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    async save(userId, recipe) {
      const { data, error } = await supabase
        .from('saved_recipes')
        .insert({
          user_id: userId,
          recipe_data: recipe,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    async delete(recipeId) {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipeId);
      
      if (error) throw error;
    },
    
    async deleteAllByUser(userId) {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
    }
  }
};

export default supabase;