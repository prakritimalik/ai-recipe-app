import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentRecipes, clearRecentRecipes } from '../utils/recentRecipes';

/**
 * Custom hook for managing recent recipes
 * @returns {Object} Recent recipes state and methods
 */
export const useRecentRecipes = () => {
  const navigate = useNavigate();
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  // Load recent recipes on mount
  useEffect(() => {
    loadRecentRecipes();
  }, []);

  /**
   * Load recent recipes from localStorage
   */
  const loadRecentRecipes = () => {
    const recipes = getRecentRecipes();
    setRecentRecipes(recipes);
  };

  /**
   * Refresh recent recipes (useful after adding new recipe)
   */
  const refreshRecentRecipes = () => {
    loadRecentRecipes();
  };

  /**
   * Handle viewing a recent recipe
   * @param {Object} recipe - Recipe to view
   */
  const handleViewRecipe = (recipe) => {
    // Store recipe in localStorage for detail page access
    localStorage.setItem(`recipe_${recipe.id}`, JSON.stringify(recipe));
    
    // Navigate to recipe detail page
    navigate(`/recipe/${recipe.id}`);
  };

  /**
   * Show clear confirmation modal
   */
  const handleClearRecentRecipes = () => {
    setShowClearConfirmation(true);
  };

  /**
   * Confirm clearing all recent recipes
   */
  const confirmClearRecentRecipes = () => {
    clearRecentRecipes();
    setRecentRecipes([]);
    setShowClearConfirmation(false);
  };

  /**
   * Cancel clearing recent recipes
   */
  const cancelClearRecentRecipes = () => {
    setShowClearConfirmation(false);
  };

  return {
    // State
    recentRecipes,
    showClearConfirmation,
    
    // Actions
    loadRecentRecipes,
    refreshRecentRecipes,
    handleViewRecipe,
    handleClearRecentRecipes,
    confirmClearRecentRecipes,
    cancelClearRecentRecipes,
  };
};