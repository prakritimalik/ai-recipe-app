import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useDatabase } from './useDatabase';

/**
 * Custom hook for recipe saving/unsaving logic
 * @returns {Object} Recipe saving state and methods
 */
export const useRecipeSaving = () => {
  const { user } = useAuth();
  const { saveRecipe, getUserSavedRecipes, deleteRecipe } = useDatabase();
  const navigate = useNavigate();
  const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());

  // Load saved recipe IDs when user changes
  useEffect(() => {
    loadSavedRecipeIds();
  }, [user]);

  /**
   * Load saved recipe IDs to mark recipes as saved
   */
  const loadSavedRecipeIds = async () => {
    if (!user) {
      setSavedRecipeIds(new Set());
      return;
    }
    
    try {
      const savedRecipes = await getUserSavedRecipes(user.id);
      const savedIds = new Set(savedRecipes.map(recipe => recipe.id));
      setSavedRecipeIds(savedIds);
    } catch (error) {
      console.error('Error loading saved recipe IDs:', error);
    }
  };

  /**
   * Handle saving/unsaving a recipe to user's favorites
   * @param {Object} recipe - Recipe to save or unsave
   * @param {Function} onSuccess - Callback for successful save/unsave
   * @param {Function} onError - Callback for error
   */
  const handleSaveRecipe = async (recipe, onSuccess, onError) => {
    if (!user) {
      // This shouldn't happen since hearts are hidden for non-logged-in users
      // but keeping as a safety fallback - just navigate to register
      navigate('/register');
      return;
    }

    try {
      const isCurrentlySaved = savedRecipeIds.has(recipe.id);
      
      if (isCurrentlySaved) {
        // Recipe is saved, so unsave it
        const savedRecipes = await getUserSavedRecipes(user.id);
        const savedRecipe = savedRecipes.find(sr => sr.id === recipe.id);
        
        if (savedRecipe && savedRecipe.savedRecipeId) {
          await deleteRecipe(savedRecipe.savedRecipeId);
          
          // Update saved recipe IDs
          setSavedRecipeIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(recipe.id);
            return newSet;
          });
          
          onSuccess?.('unsaved');
        }
      } else {
        // Recipe is not saved, so save it
        const savedResult = await saveRecipe(recipe, user.id);
        
        // Update saved recipe IDs
        setSavedRecipeIds(prev => new Set([...prev, recipe.id]));
        
        onSuccess?.('saved');
      }
    } catch (err) {
      console.error('Error saving/unsaving recipe:', err);
      onError?.(err.message || 'Failed to save recipe. Please try again.');
    }
  };

  /**
   * Check if a recipe is saved
   * @param {string} recipeId - Recipe ID to check
   * @returns {boolean} Whether the recipe is saved
   */
  const isRecipeSaved = (recipeId) => {
    return savedRecipeIds.has(recipeId);
  };

  /**
   * Refresh saved recipe IDs (useful after bulk operations)
   */
  const refreshSavedRecipeIds = () => {
    loadSavedRecipeIds();
  };

  return {
    // State
    savedRecipeIds,
    
    // Actions
    handleSaveRecipe,
    isRecipeSaved,
    refreshSavedRecipeIds,
    loadSavedRecipeIds,
  };
};