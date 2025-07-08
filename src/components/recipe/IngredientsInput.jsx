import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Input } from '../ui';

/**
 * Modern ingredients input component with pill/tag design
 * @param {Object} props - Component props
 * @param {Array} props.ingredients - Array of ingredient strings
 * @param {Function} props.onChange - Callback when ingredients change
 * @param {string} props.placeholder - Input placeholder text
 * @returns {JSX.Element} IngredientsInput component
 */
const IngredientsInput = ({ 
  ingredients = [''], 
  onChange, 
  placeholder = "Enter an ingredient (e.g., tomatoes, chicken, rice)" 
}) => {
  const [currentInput, setCurrentInput] = useState('');

  // Filter out empty ingredients for display
  const validIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');

  /**
   * Add a new ingredient
   */
  const addIngredient = () => {
    const trimmedInput = currentInput.trim();
    
    if (trimmedInput === '') return;
    
    // Check for duplicates (case insensitive)
    const isDuplicate = validIngredients.some(
      ingredient => ingredient.toLowerCase() === trimmedInput.toLowerCase()
    );
    
    if (isDuplicate) {
      setCurrentInput('');
      return;
    }

    // Add the new ingredient
    const newIngredients = [...validIngredients, trimmedInput];
    onChange(newIngredients);
    setCurrentInput('');
  };

  /**
   * Remove an ingredient by index
   */
  const removeIngredient = (indexToRemove) => {
    const newIngredients = validIngredients.filter((_, index) => index !== indexToRemove);
    onChange(newIngredients.length > 0 ? newIngredients : ['']); // Always keep at least empty string
  };

  /**
   * Handle input key press
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    } else if (e.key === 'Backspace' && currentInput === '' && validIngredients.length > 0) {
      // Remove last ingredient if input is empty and backspace is pressed
      removeIngredient(validIngredients.length - 1);
    }
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    setCurrentInput(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <h3 className="text-base font-medium text-gray-900 mb-2">Ingredients</h3>

      {/* Input Section */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="w-full"
          />
        </div>
        <Button
          type="button"
          onClick={addIngredient}
          variant="primary"
          size="sm"
          className="px-4 py-2"
          disabled={currentInput.trim() === ''}
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* Added Ingredients Display */}
      {validIngredients.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Added ingredients ({validIngredients.length}):
          </p>
          
          <div className="flex flex-wrap gap-2">
            {validIngredients.map((ingredient, index) => (
              <div
                key={`${ingredient}-${index}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 border border-primary-200"
              >
                <span>{ingredient}</span>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="ml-2 text-primary-600 hover:text-primary-800 transition-colors"
                  aria-label={`Remove ${ingredient}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        Press Enter or click + to add ingredients. Use Backspace to remove the last ingredient.
      </p>
    </div>
  );
};

export default IngredientsInput;