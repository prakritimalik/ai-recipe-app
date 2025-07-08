import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { RegisterForm } from '../components/auth';
import { useAuth } from '../hooks/useAuth';

/**
 * Register page
 * @returns {JSX.Element} Register page
 */
const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle registration form submission
   * @param {Object} formData - Registration form data
   */
  const handleRegister = async (formData) => {
    try {
      setError('');
      setIsLoading(true);
      
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      const { user, error } = await signUp(formData.email, formData.password, formData.name);
      
      if (error) {
        setError(error);
        return;
      }
      
      // Clean up any old pending recipe data
      localStorage.removeItem('pendingRecipeToSave');
      
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Register;