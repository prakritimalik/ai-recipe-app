import React from 'react';
import { RecipeDetail } from '../recipe';
import { Button } from '../ui';

/**
 * Component to display the generated recipe with action buttons
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Generated recipe object
 * @param {boolean} props.isSaved - Whether the recipe is saved
 * @param {string} props.error - Error message if any
 * @param {Function} props.onSave - Callback for saving recipe
 * @param {Function} props.onShare - Callback for sharing recipe
 * @param {Function} props.onGenerateNew - Callback for generating new recipe
 * @param {string} props.buttonText - Custom text for the generate new button
 * @returns {JSX.Element} GeneratedRecipeDisplay component
 */
const GeneratedRecipeDisplay = ({ 
  recipe, 
  isSaved, 
  error, 
  onSave, 
  onShare, 
  onGenerateNew,
  buttonText = "← Generate New Recipe"
}) => {
  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onGenerateNew}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <span>{buttonText}</span>
        </Button>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Full Recipe Display */}
      <RecipeDetail
        recipe={recipe}
        onSave={onSave}
        onShare={onShare}
        isSaved={isSaved}
      />
    </div>
  );
};

export default GeneratedRecipeDisplay;