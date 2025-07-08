import { useState } from 'react';
import { supabase, db } from '../services/supabase';

/**
 * Custom hook for database operations
 * @returns {Object} Database operations and state
 */
export const useDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Clear error state
   */
  const clearError = () => setError(null);


  /**
   * Get user's saved recipes
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of saved recipes
   */
  const getUserSavedRecipes = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const recipes = await db.recipes.getByUser(userId);
      
      // Transform the data to match our app's recipe format
      return recipes.map(savedRecipe => ({
        ...savedRecipe.recipe_data,
        savedRecipeId: savedRecipe.id, // Keep track of the saved recipe ID for deletion
        savedAt: savedRecipe.created_at
      }));
    } catch (err) {
      console.error('Error getting user saved recipes:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save a recipe for a user
   * @param {Object} recipe - Recipe to save
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Saved recipe or null
   */
  const saveRecipe = async (recipe, userId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Remove any saved recipe metadata before saving
      const { savedRecipeId, savedAt, ...cleanRecipe } = recipe;
      
      const savedRecipe = await db.recipes.save(userId, cleanRecipe);
      return {
        ...cleanRecipe,
        savedRecipeId: savedRecipe.id,
        savedAt: savedRecipe.created_at
      };
    } catch (err) {
      console.error('Error saving recipe:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a saved recipe
   * @param {string} savedRecipeId - Saved recipe ID (not the recipe ID)
   * @returns {Promise<boolean>} Success status
   */
  const deleteRecipe = async (savedRecipeId) => {
    try {
      setLoading(true);
      setError(null);
      await db.recipes.delete(savedRecipeId);
      return true;
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete all saved recipes for a user
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteAllRecipes = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      await db.recipes.deleteAllByUser(userId);
      return true;
    } catch (err) {
      console.error('Error deleting all recipes:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if a recipe is already saved by the user
   * @param {string} recipeId - Recipe ID to check
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Whether recipe is saved
   */
  const isRecipeSaved = async (recipeId, userId) => {
    try {
      const savedRecipes = await getUserSavedRecipes(userId);
      return savedRecipes.some(recipe => recipe.id === recipeId);
    } catch (err) {
      console.error('Error checking if recipe is saved:', err);
      return false;
    }
  };

  return {
    // State
    loading,
    error,
    clearError,
    
    // Recipe operations
    getUserSavedRecipes,
    saveRecipe,
    deleteRecipe,
    deleteAllRecipes,
    isRecipeSaved,
  };
};

export default useDatabase;