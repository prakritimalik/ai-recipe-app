import { useState } from 'react';
import { useOpenAI } from './useOpenAI';
import { addRecentRecipe, getRecentRecipes } from '../utils/recentRecipes';

/**
 * Custom hook for recipe generation logic
 * @returns {Object} Recipe generation state and methods
 */
export const useRecipeGeneration = () => {
  const { generateRecipe: generateRecipeAPI, isLoading } = useOpenAI();
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  /**
   * Handle recipe generation form submission
   * @param {Object} formData - Form data from RecipeForm
   * @returns {Promise<Object[]|null>} Generated recipes array or null
   */
  const generateRecipe = async (formData) => {
    try {
      setError('');
      setGeneratedRecipes([]);
      setSelectedRecipe(null);
      setIsSaved(false);
      
      // Store form data for potential regeneration
      setLastFormData(formData);
      
      const recipes = await generateRecipeAPI(formData);
      setGeneratedRecipes(recipes);
      
      // Auto-save all recipes to recent recipes
      recipes.forEach(recipe => addRecentRecipe(recipe));
      
      return recipes;
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate recipes. Please try again.';
      setError(errorMessage);
      return null;
    }
  };

  /**
   * Select a recipe from the generated options
   * @param {Object} recipe - Recipe to select
   */
  const selectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsSaved(false);
  };

  /**
   * Generate more recipe options using the same form data
   * @returns {Promise<Object[]|null>} New recipes array or null
   */
  const generateMoreOptions = async () => {
    if (!lastFormData) {
      setError('No previous search criteria found. Please start a new search.');
      return null;
    }

    try {
      setError('');
      setSelectedRecipe(null);
      setIsSaved(false);
      
      const newRecipes = await generateRecipeAPI(lastFormData);
      
      // Replace current recipes with new ones
      setGeneratedRecipes(newRecipes);
      
      // Auto-save all new recipes to recent recipes
      newRecipes.forEach(recipe => addRecentRecipe(recipe));
      
      return newRecipes;
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate more recipes. Please try again.';
      setError(errorMessage);
      return null;
    }
  };

  /**
   * Clear the generated recipes and start fresh
   */
  const clearGeneratedRecipes = () => {
    setGeneratedRecipes([]);
    setSelectedRecipe(null);
    setLastFormData(null);
    setIsSaved(false);
    setError('');
  };

  /**
   * Go back to recipe selection from detailed view
   */
  const backToSelection = () => {
    setSelectedRecipe(null);
    setIsSaved(false);
  };

  /**
   * Mark the current recipe as saved
   */
  const markAsSaved = () => {
    setIsSaved(true);
  };

  /**
   * Mark the current recipe as unsaved
   */
  const markAsUnsaved = () => {
    setIsSaved(false);
  };

  return {
    // State
    generatedRecipes,
    selectedRecipe,
    isLoading,
    error,
    isSaved,
    
    // Actions
    generateRecipe,
    generateMoreOptions,
    selectRecipe,
    clearGeneratedRecipes,
    backToSelection,
    markAsSaved,
    markAsUnsaved,
  };
};