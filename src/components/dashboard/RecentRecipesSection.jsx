import React from 'react';
import { RecipeCard } from '../recipe';
import { useAuth } from '../../hooks/useAuth';

/**
 * Section component for displaying recent recipes
 * @param {Object} props - Component props
 * @param {Array} props.recentRecipes - Array of recent recipes
 * @param {Function} props.onSaveRecipe - Callback for saving/unsaving recipes
 * @param {Function} props.onViewRecipe - Callback for viewing recipe details
 * @param {Function} props.onClearAll - Callback for clearing all recent recipes
 * @param {Function} props.isRecipeSaved - Function to check if recipe is saved
 * @returns {JSX.Element} RecentRecipesSection component
 */
const RecentRecipesSection = ({ 
  recentRecipes, 
  onSaveRecipe, 
  onViewRecipe, 
  onClearAll,
  isRecipeSaved 
}) => {
  const { user } = useAuth();

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6 px-4 sm:px-8 lg:px-16">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Recent Recipes
        </h2>
        {recentRecipes.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      {recentRecipes.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-6 px-4 sm:px-8 lg:px-16">
            {recentRecipes.map((recipe) => (
              <div key={recipe.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[240px]">
                <RecipeCard
                  recipe={recipe}
                  onSave={onSaveRecipe}
                  onView={onViewRecipe}
                  isSaved={isRecipeSaved(recipe.id)}
                  showSaveButton={!!user}
                />
              </div>
            ))}
          </div>
          
          {recentRecipes.length >= 4 && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                💡 Showing your {recentRecipes.length} most recent recipes. 
                Save your favorites to keep them permanently!
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            Your recently generated recipes will appear here. 
            Generate your first recipe above to get started! 🍳
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentRecipesSection;