import React from 'react';
import { Clock, Users, ChefHat, Heart, Share2, BookOpen } from 'lucide-react';
import { Button, Card } from '../ui';

/**
 * Detailed recipe view component
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Recipe data
 * @param {Function} props.onSave - Save recipe handler
 * @param {Function} props.onShare - Share recipe handler
 * @param {boolean} props.isSaved - Whether recipe is saved
 * @returns {JSX.Element} RecipeDetail component
 */
const RecipeDetail = ({ recipe, onSave, onShare, isSaved = false }) => {
  const {
    title,
    description,
    cookingTime,
    servings,
    difficulty,
    ingredients,
    instructions,
    nutrition,
    imageUrl
  } = recipe;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Recipe Header */}
      <div className="relative">
        <div className="h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
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
            <BookOpen size={96} className="text-primary-600" />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSave(recipe)}
            className="flex items-center space-x-2"
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShare(recipe)}
            className="flex items-center space-x-2"
          >
            <Share2 size={16} />
            <span>Share</span>
          </Button>
        </div>
      </div>

      {/* Recipe Info */}
      <Card>
        <Card.Header>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 text-lg">{description}</p>
        </Card.Header>

        <Card.Content>
          {/* Recipe Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock size={20} />
              <span>
                <strong>{cookingTime} minutes</strong> cooking time
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Users size={20} />
              <span>
                <strong>{servings} servings</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <ChefHat size={20} />
              <span>
                <strong>{difficulty}</strong> difficulty
              </span>
            </div>
          </div>

          {/* Nutrition Info */}
          {nutrition && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nutrition Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Calories:</span>
                  <span className="font-medium ml-2">{nutrition.calories}</span>
                </div>
                <div>
                  <span className="text-gray-600">Protein:</span>
                  <span className="font-medium ml-2">{nutrition.protein}</span>
                </div>
                <div>
                  <span className="text-gray-600">Carbs:</span>
                  <span className="font-medium ml-2">{nutrition.carbs}</span>
                </div>
                <div>
                  <span className="text-gray-600">Fat:</span>
                  <span className="font-medium ml-2">{nutrition.fat}</span>
                </div>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Recipe Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingredients */}
        <Card className="lg:col-span-1">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
          </Card.Header>
          <Card.Content>
            <ul className="space-y-2 text-left">
              {ingredients?.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-2 text-left">
                  <span className="text-primary-500 mt-1">•</span>
                  <span className="text-gray-700 text-left">{ingredient}</span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>

        {/* Instructions */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
          </Card.Header>
          <Card.Content>
            <ol className="space-y-4 text-left">
              {instructions?.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-4 text-left">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-medium text-sm">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 flex-1 text-left">{instruction}</p>
                </li>
              ))}
            </ol>
          </Card.Content>
        </Card>
      </div>

      {/* Print Button */}
      <div className="text-left">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center space-x-2"
        >
          <span>Print Recipe</span>
        </Button>
      </div>
    </div>
  );
};

export default RecipeDetail;