import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { LoginForm } from '../components/auth';
import { useAuth } from '../hooks/useAuth';

/**
 * Login page
 * @returns {JSX.Element} Login page
 */
const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle login form submission
   * @param {Object} formData - Login form data
   */
  const handleLogin = async (formData) => {
    try {
      setError('');
      setIsLoading(true);
      
      const { user, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setError(error);
        return;
      }
      
      if (user) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Login;