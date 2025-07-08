import React from 'react';
import Header from './Header';

/**
 * Main layout component that wraps all pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {Function} props.onLogoClick - Optional callback when logo is clicked
 * @param {Function} props.onLogout - Optional callback when user logs out
 * @returns {JSX.Element} Layout component
 */
const Layout = ({ children, onLogoClick, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogoClick={onLogoClick} onLogout={onLogout} />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default Layout;