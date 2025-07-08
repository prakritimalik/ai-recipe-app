import React from 'react';
import { RecipeForm } from '../recipe';
import { LoadingSpinner } from '../ui';

/**
 * Recipe generator component that handles the form and loading states
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether recipe generation is in progress
 * @param {string} props.error - Error message if generation failed
 * @param {Function} props.onGenerateRecipe - Callback for recipe generation
 * @returns {JSX.Element} RecipeGenerator component
 */
const RecipeGenerator = ({ isLoading, error, onGenerateRecipe }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-6">
        {isLoading && (
          <div 
            className="relative flex flex-col items-center justify-center py-16 text-center mb-8 rounded-xl overflow-hidden"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=1200')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '400px'
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            
            {/* Content */}
            <div className="relative z-10 text-white flex flex-col items-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-xl font-semibold">
                Our AI chef is creating your perfect recipe...
              </p>
              <p className="text-gray-200 text-sm mt-2">
                This may take a few moments
              </p>
            </div>
          </div>
        )}
        
        {!isLoading && (
          <RecipeForm 
            onSubmit={onGenerateRecipe}
            isLoading={isLoading}
          />
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md max-w-2xl mx-auto">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeGenerator;