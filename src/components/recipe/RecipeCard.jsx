import React from 'react';
import { Heart, Clock, Users, BookOpen } from 'lucide-react';
import { Card, Button } from '../ui';

/**
 * Recipe card component for displaying recipe information
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Recipe data
 * @param {Function} props.onSave - Save recipe handler
 * @param {Function} props.onView - View recipe handler
 * @param {boolean} props.isSaved - Whether recipe is saved
 * @param {boolean} props.showSaveButton - Whether to show the save button
 * @returns {JSX.Element} RecipeCard component
 */
const RecipeCard = ({ recipe, onSave, onView, isSaved = false, showSaveButton = true }) => {
  const {
    id,
    title,
    description,
    cookingTime,
    servings,
    difficulty,
    ingredients,
    imageUrl
  } = recipe;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Recipe Image */}
      <div className="relative h-40 bg-gray-200">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <BookOpen size={36} className="text-primary-600" />
        </div>
        
        {/* Save Button */}
        {showSaveButton && (
          <button
            onClick={() => onSave(recipe)}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isSaved 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Recipe Content */}
      <div className="flex-1 flex flex-col">
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-xs line-clamp-2">{description}</p>
        </Card.Header>

        <Card.Content className="flex-1">
          {/* Recipe Stats */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{cookingTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span>{servings}</span>
            </div>
            <div className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              {difficulty}
            </div>
          </div>

        </Card.Content>

        <Card.Footer>
          <Button 
            onClick={() => onView(recipe)}
            variant="outline-primary"
            className="w-full"
          >
            View Recipe
          </Button>
        </Card.Footer>
      </div>
    </Card>
  );
};

export default RecipeCard;