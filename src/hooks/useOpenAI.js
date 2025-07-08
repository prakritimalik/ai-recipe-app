import { useState, useCallback } from 'react';
import { generateRecipe as generateRecipeAPI } from '../services/recipeApi';

/**
 * Custom hook for OpenAI recipe generation
 * @returns {Object} OpenAI hook utilities
 */
export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generate recipe using OpenAI API
   * @param {Object} params - Recipe generation parameters
   * @returns {Promise<Object>} Generated recipe
   */
  const generateRecipe = useCallback(async (params) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const recipe = await generateRecipeAPI(params);
      return recipe;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generateRecipe,
    isLoading,
    error,
    clearError
  };
};