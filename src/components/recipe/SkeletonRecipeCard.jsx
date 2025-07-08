import React from 'react';
import { Card } from '../ui';

/**
 * Skeleton loading placeholder for recipe cards
 * Matches the layout and dimensions of RecipeCard component
 * @returns {JSX.Element} SkeletonRecipeCard component
 */
const SkeletonRecipeCard = () => {
  return (
    <Card className="h-full flex flex-col overflow-hidden animate-pulse">
      {/* Recipe Image Skeleton */}
      <div className="h-40 bg-gray-300"></div>

      {/* Recipe Content Skeleton */}
      <div className="flex-1 flex flex-col">
        <Card.Header>
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          {/* Description Skeleton */}
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </Card.Header>

        <Card.Content className="flex-1">
          {/* Recipe Stats Skeleton */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </div>
        </Card.Content>

        <Card.Footer>
          {/* Button Skeleton */}
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </Card.Footer>
      </div>
    </Card>
  );
};

export default SkeletonRecipeCard;