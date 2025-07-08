import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '../components/layout';
import { RecipeDetail } from '../components/recipe';
import { Button, SuccessNotification } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useRecipeSaving } from '../hooks/useRecipeSaving';

/**
 * Recipe detail page component
 * @returns {JSX.Element} RecipeDetailPage component
 */
const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleSaveRecipe, isRecipeSaved } = useRecipeSaving();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadRecipe();
  }, [id]);

  /**
   * Load recipe data
   */
  const loadRecipe = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if recipe is in localStorage (for both generated and saved recipes)
      const storedRecipe = localStorage.getItem(`recipe_${id}`);
      if (storedRecipe) {
        const parsedRecipe = JSON.parse(storedRecipe);
        setRecipe(parsedRecipe);
        setLoading(false);
        return;
      }
      
      // If not found, show error
      setError('Recipe not found');
    } catch (err) {
      setError('Recipe not found');
      console.error('Error loading recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle saving/unsaving recipe with notifications
   */
  const handleSaveRecipeWithNotification = async (recipeToSave) => {
    if (!user) {
      navigate('/login');
      return;
    }

    await handleSaveRecipe(
      recipeToSave,
      (action) => {
        // Success callback
        if (action === 'saved') {
          setNotification({
            show: true,
            message: 'Recipe saved to your collection!',
            type: 'success'
          });
        } else if (action === 'unsaved') {
          setNotification({
            show: true,
            message: 'Recipe removed from your collection!',
            type: 'error'
          });
        }
      },
      (errorMessage) => {
        // Error callback
        setNotification({
          show: true,
          message: errorMessage,
          type: 'error'
        });
      }
    );
  };

  /**
   * Handle sharing recipe
   * @param {Object} recipeToShare - Recipe to share
   */
  const handleShareRecipe = (recipeToShare) => {
    if (navigator.share) {
      navigator.share({
        title: recipeToShare.title,
        text: recipeToShare.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy recipe text to clipboard
      const recipeText = `${recipeToShare.title}\n\n${recipeToShare.description}\n\nIngredients:\n${recipeToShare.ingredients?.join('\n')}\n\nInstructions:\n${recipeToShare.instructions?.join('\n')}`;
      navigator.clipboard.writeText(recipeText).then(() => {
        setNotification({
          show: true,
          message: 'Recipe copied to clipboard!',
          type: 'success'
        });
      });
    }
  };

  /**
   * Handle closing notification
   */
  const handleCloseNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  /**
   * Handle going back
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading recipe...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !recipe) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Recipe Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The recipe you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={handleGoBack} variant="primary">
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
        </div>

        {/* Recipe Detail */}
        <RecipeDetail
          recipe={recipe}
          onSave={handleSaveRecipeWithNotification}
          onShare={handleShareRecipe}
          isSaved={recipe ? isRecipeSaved(recipe.id) : false}
        />

        {/* Success/Error Notification */}
        <SuccessNotification
          message={notification.message}
          type={notification.type}
          show={notification.show}
          onClose={handleCloseNotification}
        />
      </div>
    </Layout>
  );
};

export default RecipeDetailPage;