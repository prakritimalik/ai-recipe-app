import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../ui';
import RecipeCard from './RecipeCard';
import SkeletonRecipeCard from './SkeletonRecipeCard';

/**
 * Recipe selection grid component for displaying multiple recipe options
 * @param {Object} props - Component props
 * @param {Object[]} props.recipes - Array of recipe objects
 * @param {Function} props.onSelectRecipe - Recipe selection handler
 * @param {Function} props.onGenerateMore - Generate more recipes handler
 * @param {Function} props.onBackToForm - Back to form handler
 * @param {Function} props.onSaveRecipe - Save recipe handler
 * @param {Function} props.isRecipeSaved - Function to check if recipe is saved
 * @param {Object} props.user - Current user object (null if not logged in)
 * @param {boolean} props.isLoading - Whether new recipes are being generated
 * @returns {JSX.Element} RecipeSelectionGrid component
 */
const RecipeSelectionGrid = ({ 
  recipes, 
  onSelectRecipe, 
  onGenerateMore, 
  onBackToForm,
  onSaveRecipe,
  isRecipeSaved,
  user,
  isLoading = false
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="text-primary-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">
            Choose Your Perfect Recipe
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {isLoading 
            ? "Our AI chef is creating 4 new delicious options for you..."
            : `We've created ${recipes.length} delicious recipe options for you. Click on any recipe card to view the full details and cooking instructions.`
          }
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="flex flex-wrap justify-center gap-6 px-4 sm:px-8 lg:px-16">
        {isLoading ? (
          // Show 4 skeleton cards while loading
          Array.from({ length: 4 }, (_, index) => (
            <div key={`skeleton-${index}`} className="w-full sm:w-[calc(50%-12px)] lg:w-[240px]">
              <SkeletonRecipeCard />
            </div>
          ))
        ) : (
          // Show actual recipe cards
          recipes.map((recipe, index) => (
            <div key={recipe.id || index} className="w-full sm:w-[calc(50%-12px)] lg:w-[240px]">
              <RecipeCard
                recipe={recipe}
                onView={onSelectRecipe}
                onSave={onSaveRecipe}
                isSaved={isRecipeSaved(recipe.id)}
                showSaveButton={!!user}
              />
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
        <Button
          onClick={onBackToForm}
          variant="outline"
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          <ArrowLeft size={16} className="mr-2" />
          Try Different Ingredients
        </Button>
        
        <Button
          onClick={onGenerateMore}
          variant="primary"
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          <Sparkles size={16} className="mr-2" />
          {isLoading ? "Generating..." : "Generate More Options"}
        </Button>
      </div>
    </div>
  );
};

export default RecipeSelectionGrid;