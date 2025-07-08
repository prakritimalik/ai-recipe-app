/**
 * Utility functions for managing recent recipes in localStorage
 */

const RECENT_RECIPES_KEY = 'recipeai_recent_recipes';
const MAX_RECENT_RECIPES = 8;

/**
 * Get recent recipes from localStorage
 * @returns {Array} Array of recent recipes
 */
export const getRecentRecipes = () => {
  try {
    const stored = localStorage.getItem(RECENT_RECIPES_KEY);
    const recipes = stored ? JSON.parse(stored) : [];
    
    // Trim to max limit if needed (for when limit was reduced)
    if (recipes.length > MAX_RECENT_RECIPES) {
      const trimmed = recipes.slice(0, MAX_RECENT_RECIPES);
      localStorage.setItem(RECENT_RECIPES_KEY, JSON.stringify(trimmed));
      return trimmed;
    }
    
    return recipes;
  } catch (error) {
    console.error('Error loading recent recipes:', error);
    return [];
  }
};

/**
 * Add a recipe to recent recipes
 * @param {Object} recipe - Recipe to add
 */
export const addRecentRecipe = (recipe) => {
  try {
    const recentRecipes = getRecentRecipes();
    
    // Remove if already exists (to avoid duplicates and move to top)
    const filteredRecipes = recentRecipes.filter(r => r.id !== recipe.id);
    
    // Add to beginning of array
    const updatedRecipes = [recipe, ...filteredRecipes];
    
    // Keep only the most recent ones
    const trimmedRecipes = updatedRecipes.slice(0, MAX_RECENT_RECIPES);
    
    // Save to localStorage
    localStorage.setItem(RECENT_RECIPES_KEY, JSON.stringify(trimmedRecipes));
  } catch (error) {
    console.error('Error saving recent recipe:', error);
  }
};

/**
 * Remove a recipe from recent recipes
 * @param {string} recipeId - Recipe ID to remove
 */
export const removeRecentRecipe = (recipeId) => {
  try {
    const recentRecipes = getRecentRecipes();
    const filteredRecipes = recentRecipes.filter(r => r.id !== recipeId);
    localStorage.setItem(RECENT_RECIPES_KEY, JSON.stringify(filteredRecipes));
  } catch (error) {
    console.error('Error removing recent recipe:', error);
  }
};

/**
 * Clear all recent recipes
 */
export const clearRecentRecipes = () => {
  try {
    localStorage.removeItem(RECENT_RECIPES_KEY);
  } catch (error) {
    console.error('Error clearing recent recipes:', error);
  }
};

/**
 * Check if a recipe is in recent recipes
 * @param {string} recipeId - Recipe ID to check
 * @returns {boolean} Whether recipe is in recent recipes
 */
export const isRecentRecipe = (recipeId) => {
  const recentRecipes = getRecentRecipes();
  return recentRecipes.some(r => r.id === recipeId);
};