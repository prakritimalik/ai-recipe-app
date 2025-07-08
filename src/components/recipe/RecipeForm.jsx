import React, { useState } from 'react';
import { ChefHat, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Input, Card } from '../ui';
import { IngredientsInput } from './';

/**
 * Recipe generation form component
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element} RecipeForm component
 */
const RecipeForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    ingredients: [''],
    cuisine: '',
    dietaryRestrictions: [],
    cookingTime: '',
    servings: '',
    difficulty: 'medium'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const cuisineOptions = [
    'Any', 'Italian', 'Mexican', 'Chinese', 'Indian', 'Mediterranean', 
    'French', 'Japanese', 'Thai', 'American', 'Korean', 'Vietnamese'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 
    'Low-Carb', 'High-Protein', 'Nut-Free'
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const toggleDietaryRestriction = (restriction) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(ingredient => ingredient.trim())
    };
    
    // Scroll to top immediately when form is submitted for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    onSubmit(cleanedData);
  };

  const isFormValid = formData.ingredients.some(ingredient => ingredient.trim());

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <Card.Header>
        <div className="flex items-center space-x-2">
          <ChefHat className="text-primary-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Generate Recipe</h2>
        </div>
        <p className="text-gray-600 mt-2">
          Tell us what ingredients you have and we'll create a delicious recipe for you!
        </p>
      </Card.Header>

      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ingredients */}
          <IngredientsInput
            ingredients={formData.ingredients}
            onChange={(newIngredients) => handleInputChange('ingredients', newIngredients)}
          />

          {/* Cuisine */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Cuisine Type
            </label>
            <select
              value={formData.cuisine}
              onChange={(e) => handleInputChange('cuisine', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">Select cuisine...</option>
              {cuisineOptions.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Dietary Restrictions <span className="text-gray-500 text-sm">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleDietaryRestriction(option)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.dietaryRestrictions.includes(option)
                      ? 'bg-orange-100 text-orange-800 border border-orange-200 shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors py-1"
            >
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <span>Advanced Settings</span>
              <span className="text-xs text-gray-500 font-normal">
                ({showAdvanced ? 'Hide' : 'Show'} cooking time, servings, difficulty)
              </span>
            </button>
            
            {showAdvanced && (
              <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {/* All Advanced Settings in One Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Input
                    label="Cooking Time (minutes)"
                    type="number"
                    placeholder="30"
                    value={formData.cookingTime}
                    onChange={(e) => handleInputChange('cookingTime', e.target.value)}
                    min="1"
                    max="480"
                  />
                  <Input
                    label="Number of Servings"
                    type="number"
                    placeholder="4"
                    value={formData.servings}
                    onChange={(e) => handleInputChange('servings', e.target.value)}
                    min="1"
                    max="20"
                  />
                  
                  {/* Difficulty */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <div className="flex flex-col space-y-2">
                      {difficultyOptions.map(option => (
                        <label key={option.value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="difficulty"
                            value={option.value}
                            checked={formData.difficulty === option.value}
                            onChange={(e) => handleInputChange('difficulty', e.target.value)}
                            className="text-primary-600"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </form>
      </Card.Content>

      <Card.Footer>
        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={!isFormValid || isLoading}
          className="w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating Recipe...</span>
            </>
          ) : (
            <>
              <ChefHat size={20} />
              <span>Generate Recipe</span>
            </>
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default RecipeForm;