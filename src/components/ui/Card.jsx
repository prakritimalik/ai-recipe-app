import React from 'react';

/**
 * Reusable Card component for displaying content in a styled container
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Card component
 */
const Card = ({ children, className = '' }) => {
  const cardClasses = `
    bg-white rounded-lg shadow-md border border-gray-200
    hover:shadow-lg transition-shadow duration-200
    ${className}
  `;

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

/**
 * Card Header component
 */
const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-3 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card Content component
 */
const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-3 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card Footer component
 */
const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-3 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;