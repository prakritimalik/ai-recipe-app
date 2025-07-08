import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout';
import { 
  DashboardHeader, 
  RecipeGenerator, 
  GeneratedRecipeDisplay, 
  RecentRecipesSection 
} from '../components/dashboard';
import { RecipeSelectionGrid } from '../components/recipe';
import { SuccessNotification, ConfirmationModal } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useRecipeGeneration } from '../hooks/useRecipeGeneration';
import { useRecipeSaving } from '../hooks/useRecipeSaving';
import { useRecentRecipes } from '../hooks/useRecentRecipes';

/**
 * Dashboard page for generating and managing recipes
 * @returns {JSX.Element} Dashboard page
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Custom hooks for business logic
  const { 
    generatedRecipes,
    selectedRecipe, 
    isLoading, 
    error, 
    isSaved, 
    generateRecipe,
    generateMoreOptions,
    selectRecipe, 
    clearGeneratedRecipes,
    backToSelection, 
    markAsSaved, 
    markAsUnsaved 
  } = useRecipeGeneration();

  const { 
    handleSaveRecipe, 
    isRecipeSaved, 
    refreshSavedRecipeIds 
  } = useRecipeSaving();

  const { 
    recentRecipes,
    showClearConfirmation,
    handleViewRecipe, 
    refreshRecentRecipes,
    handleClearRecentRecipes,
    confirmClearRecentRecipes,
    cancelClearRecentRecipes
  } = useRecentRecipes();

  // Check if user is new and cleanup data on mount
  useEffect(() => {
    checkIfNewUser();
    cleanupObsoleteData();
    // Note: refreshSavedRecipeIds() is not needed here as useRecipeSaving
    // already loads saved recipe IDs when user changes
  }, [user]);

  /**
   * Check if user is new (created account recently)
   */
  const checkIfNewUser = () => {
    if (!user) {
      setIsNewUser(false);
      return;
    }
    
    // Check if user was created in the last 5 minutes
    const userCreatedAt = new Date(user.created_at);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    setIsNewUser(userCreatedAt > fiveMinutesAgo);
  };

  /**
   * Clean up obsolete data from localStorage
   */
  const cleanupObsoleteData = () => {
    // Remove any leftover pending recipe data
    localStorage.removeItem('pendingRecipeToSave');
  };

  /**
   * Handle recipe generation
   */
  const handleGenerateRecipe = async (formData) => {
    const recipes = await generateRecipe(formData);
    if (recipes && recipes.length > 0) {
      refreshRecentRecipes();
    }
  };

  /**
   * Handle recipe selection from grid
   */
  const handleSelectRecipe = (recipe) => {
    selectRecipe(recipe);
  };

  /**
   * Handle generating more recipe options
   */
  const handleGenerateMore = async () => {
    const newRecipes = await generateMoreOptions();
    if (newRecipes && newRecipes.length > 0) {
      refreshRecentRecipes();
    }
  };

  /**
   * Handle going back to recipe form
   */
  const handleBackToForm = () => {
    clearGeneratedRecipes();
  };

  /**
   * Handle logo click - go back to form if recipes are visible
   */
  const handleLogoClick = () => {
    if (generatedRecipes.length > 0 || selectedRecipe) {
      clearGeneratedRecipes();
    }
    // If no recipes are shown, let normal navigation happen
  };

  /**
   * Handle user logout - clear recipes for clean slate
   */
  const handleLogout = () => {
    clearGeneratedRecipes();
  };

  /**
   * Handle saving/unsaving recipes with notifications
   */
  const handleSaveRecipeWithNotification = async (recipe) => {
    await handleSaveRecipe(
      recipe,
      (action) => {
        // Success callback
        if (action === 'saved') {
          markAsSaved();
          setNotification({
            show: true,
            message: 'Recipe saved to your collection!',
            type: 'success'
          });
        } else if (action === 'unsaved') {
          markAsUnsaved();
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
   */
  const handleShareRecipe = (recipe) => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.description,
        url: window.location.origin + `/recipe/${recipe.id}`,
      });
    } else {
      // Fallback: copy recipe text to clipboard
      const recipeText = `${recipe.title}\n\n${recipe.description}\n\nIngredients:\n${recipe.ingredients?.join('\n')}\n\nInstructions:\n${recipe.instructions?.join('\n')}`;
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

  return (
    <Layout onLogoClick={handleLogoClick} onLogout={handleLogout}>
      <div className="w-full">
        <DashboardHeader 
          isNewUser={isNewUser} 
          showWelcomeText={generatedRecipes.length === 0 && !selectedRecipe && !isLoading}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">

        {/* Show recipe generator, recipe selection grid, or selected recipe */}
        {generatedRecipes.length === 0 ? (
          <RecipeGenerator
            isLoading={isLoading}
            error={error}
            onGenerateRecipe={handleGenerateRecipe}
          />
        ) : selectedRecipe ? (
          <GeneratedRecipeDisplay
            recipe={selectedRecipe}
            isSaved={isSaved}
            error={error}
            onSave={handleSaveRecipeWithNotification}
            onShare={handleShareRecipe}
            onGenerateNew={backToSelection}
            buttonText="Back to Options"
          />
        ) : (
          <RecipeSelectionGrid
            recipes={generatedRecipes}
            onSelectRecipe={handleSelectRecipe}
            onGenerateMore={handleGenerateMore}
            onBackToForm={handleBackToForm}
            onSaveRecipe={handleSaveRecipeWithNotification}
            isRecipeSaved={isRecipeSaved}
            user={user}
            isLoading={isLoading}
          />
        )}

        {/* Recent Recipes Section - hide when loading or when recipes are generated or viewing individual recipe */}
        {generatedRecipes.length === 0 && !selectedRecipe && !isLoading && (
          <div className="transition-all duration-500 ease-in-out">
            <RecentRecipesSection
              recentRecipes={recentRecipes}
              onSaveRecipe={handleSaveRecipeWithNotification}
              onViewRecipe={handleViewRecipe}
              onClearAll={handleClearRecentRecipes}
              isRecipeSaved={isRecipeSaved}
            />
          </div>
        )}

        {/* Success/Error Notification */}
        <SuccessNotification
          message={notification.message}
          type={notification.type}
          show={notification.show}
          onClose={handleCloseNotification}
        />

        {/* Clear All Confirmation Modal */}
        <ConfirmationModal
          isOpen={showClearConfirmation}
          title="Clear Recent Recipes"
          message="Are you sure you want to clear all recent recipes? This action cannot be undone."
          confirmText="Clear All"
          cancelText="Cancel"
          confirmVariant="primary"
          onConfirm={confirmClearRecentRecipes}
          onCancel={cancelClearRecentRecipes}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;