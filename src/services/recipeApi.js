import { supabase } from './supabase';

/**
 * Generate multiple recipes using Supabase Edge Function
 * @param {Object} params - Recipe generation parameters
 * @param {string[]} params.ingredients - List of ingredients
 * @param {string} params.cuisine - Cuisine type
 * @param {string[]} params.dietaryRestrictions - Dietary restrictions
 * @param {string} params.cookingTime - Cooking time in minutes
 * @param {string} params.servings - Number of servings
 * @param {string} params.difficulty - Difficulty level
 * @returns {Promise<Object[]>} Array of generated recipe objects
 */
export async function generateRecipe(params) {
  try {
    // Clean up the parameters
    const cleanParams = {
      ingredients: params.ingredients.filter(ingredient => ingredient.trim()),
      cuisine: params.cuisine || '',
      dietaryRestrictions: params.dietaryRestrictions || [],
      cookingTime: params.cookingTime || '',
      servings: params.servings || '',
      difficulty: params.difficulty || 'medium'
    };

    // Validate required fields
    if (!cleanParams.ingredients || cleanParams.ingredients.length === 0) {
      throw new Error('At least one ingredient is required');
    }

    // Call the Supabase Edge Function (uses anon key automatically for unauthenticated users)
    const { data, error } = await supabase.functions.invoke('generate-recipe', {
      body: cleanParams
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to generate recipes');
    }

    if (!data || !data.recipes) {
      throw new Error('Invalid response format from recipe service');
    }

    return data.recipes;

  } catch (error) {
    console.error('Error generating recipe:', error);
    
    // Provide user-friendly error messages
    if (error.message.includes('At least one ingredient')) {
      throw new Error('Please add at least one ingredient to generate recipes.');
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    if (error.message.includes('timeout')) {
      throw new Error('Request timed out. Please try again with fewer ingredients or simpler requirements.');
    }
    
    // Generic fallback
    throw new Error(error.message || 'Failed to generate recipes. Please try again.');
  }
}

/**
 * Generate a unique recipe ID
 * @returns {string} Unique recipe ID
 */
export function generateRecipeId() {
  return `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}