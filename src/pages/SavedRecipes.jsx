import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Layout } from '../components/layout';
import { RecipeCard } from '../components/recipe';
import { Button, Input, ConfirmationModal } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useDatabase } from '../hooks/useDatabase';

/**
 * Saved recipes page
 * @returns {JSX.Element} SavedRecipes page
 */
const SavedRecipes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getUserSavedRecipes, deleteRecipe, deleteAllRecipes } = useDatabase();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('all');
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  useEffect(() => {
    loadSavedRecipes();
  }, [user]);

  /**
   * Load saved recipes from Supabase
   */
  const loadSavedRecipes = async () => {
    if (!user) {
      console.log('❌ No user found, skipping recipe load');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Loading saved recipes for user:', user.id);
      const recipes = await getUserSavedRecipes(user.id);
      console.log('📦 Loaded recipes:', recipes);
      setSavedRecipes(recipes);
    } catch (error) {
      console.error('Error loading saved recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle recipe deletion
   * @param {string} recipeId - Recipe ID to delete
   */
  const handleDeleteRecipe = async (savedRecipeId) => {
    try {
      await deleteRecipe(savedRecipeId);
      setSavedRecipes(prev => prev.filter(recipe => recipe.savedRecipeId !== savedRecipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  /**
   * Handle clearing all saved recipes
   */
  const handleClearAllRecipes = () => {
    setShowClearConfirmation(true);
  };

  /**
   * Confirm clearing all saved recipes
   */
  const confirmClearAllRecipes = async () => {
    try {
      await deleteAllRecipes(user.id);
      setSavedRecipes([]);
      setShowClearConfirmation(false);
    } catch (error) {
      console.error('Error clearing all recipes:', error);
    }
  };

  /**
   * Cancel clearing all saved recipes
   */
  const cancelClearAllRecipes = () => {
    setShowClearConfirmation(false);
  };

  /**
   * Handle viewing recipe details
   * @param {Object} recipe - Recipe to view
   */
  const handleViewRecipe = (recipe) => {
    // Store recipe in localStorage for detail page access
    localStorage.setItem(`recipe_${recipe.id}`, JSON.stringify(recipe));
    
    // Navigate to recipe detail page
    navigate(`/recipe/${recipe.id}`);
  };

  // Filter recipes based on search term and cuisine
  const filteredRecipes = savedRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = filterCuisine === 'all' || recipe.cuisine === filterCuisine;
    return matchesSearch && matchesCuisine;
  });

  // Get unique cuisines for filter
  const cuisines = [...new Set(savedRecipes.map(recipe => recipe.cuisine).filter(Boolean))];

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your saved recipes...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 px-4 sm:px-8 lg:px-16">
            <h1 className="text-3xl font-bold text-gray-900">Saved Recipes</h1>
            {user && savedRecipes.length > 0 && (
              <button
                onClick={() => setShowClearConfirmation(true)}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <p className="text-gray-600 mt-2 px-4 sm:px-8 lg:px-16">
            Your personal collection of favorite recipes
          </p>
        </div>

        {/* Search and Filter Bar */}
        {user && (
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between px-4 sm:px-8 lg:px-16">
          <div className="flex-1 flex flex-col sm:flex-row gap-4 max-w-2xl">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Cuisine Filter */}
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterCuisine}
                onChange={(e) => setFilterCuisine(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="all">All Cuisines</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
          </div>

          </div>
        )}

        {/* Results Count */}
        {user && (
          <div className="mb-6 px-4 sm:px-8 lg:px-16">
            <p className="text-sm text-gray-600">
              Showing {filteredRecipes.length} of {savedRecipes.length} recipes
            </p>
          </div>
        )}

        {/* Recipes Grid/List */}
        {!user ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-600 mb-4">
                Please sign in to view your saved recipes.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                variant="primary"
              >
                Sign In
              </Button>
            </div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-600 mb-4">
                {savedRecipes.length === 0 
                  ? "You haven't saved any recipes yet." 
                  : "No recipes match your search criteria."
                }
              </p>
              {savedRecipes.length === 0 && (
                <Button 
                  onClick={() => navigate('/')}
                  variant="primary"
                >
                  Generate Your First Recipe
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 px-4 sm:px-8 lg:px-16">
            {filteredRecipes.map(recipe => (
              <div key={recipe.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[240px]">
                <RecipeCard
                  recipe={recipe}
                  onSave={() => handleDeleteRecipe(recipe.savedRecipeId)}
                  onView={handleViewRecipe}
                  isSaved={true}
                />
              </div>
            ))}
          </div>
        )}

        {/* Clear All Confirmation Modal */}
        <ConfirmationModal
          isOpen={showClearConfirmation}
          title="Clear All Saved Recipes"
          message="Are you sure you want to delete all saved recipes? This action cannot be undone."
          confirmText="Clear All"
          cancelText="Cancel"
          confirmVariant="primary"
          onConfirm={confirmClearAllRecipes}
          onCancel={cancelClearAllRecipes}
        />
      </div>
    </Layout>
  );
};

export default SavedRecipes;