import React from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Dashboard header component with welcome message
 * @param {Object} props - Component props
 * @param {boolean} props.isNewUser - Whether the user is new (created recently)
 * @param {boolean} props.showWelcomeText - Whether to show welcome text (default: true)
 * @returns {JSX.Element} DashboardHeader component
 */
const DashboardHeader = ({ isNewUser, showWelcomeText = true }) => {
  const { user } = useAuth();

  return (
    <div className={`w-full text-center px-4 sm:px-6 lg:px-8 ${showWelcomeText ? 'mb-8 py-8' : 'mb-4 py-4'}`}>
      {showWelcomeText && (
        <>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {user 
              ? `${isNewUser ? 'Welcome' : 'Welcome back'}${user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!` 
              : 'AI Recipe Generator'
            }
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {user 
              ? "What would you like to cook today? Tell us what ingredients you have."
              : "Generate personalized recipes from your ingredients using AI. Try it now - no signup required!"
            }
          </p>
          {!user && (
            <p className="text-sm text-gray-500 mt-2">
              💡 Sign up to save your favorite recipes
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardHeader;