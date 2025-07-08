import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Sparkles, Heart, Clock } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { Layout } from '../components/layout';

/**
 * Home page component
 * @returns {JSX.Element} Home page
 */
const Home = () => {
  const features = [
    {
      icon: <ChefHat size={32} />,
      title: 'AI-Powered Recipes',
      description: 'Generate personalized recipes based on your available ingredients and preferences.'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Smart Suggestions',
      description: 'Get intelligent recipe recommendations tailored to your dietary needs and cuisine preferences.'
    },
    {
      icon: <Heart size={32} />,
      title: 'Save Favorites',
      description: 'Keep track of your favorite recipes and build your personal cookbook collection.'
    },
    {
      icon: <Clock size={32} />,
      title: 'Quick & Easy',
      description: 'Find recipes that fit your schedule with customizable cooking time filters.'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Cook Smarter with{' '}
                <span className="text-primary-200">AI-Powered</span> Recipes
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Transform your available ingredients into delicious recipes with the power of artificial intelligence. 
                No more wondering what to cook!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3"
                  >
                    Start Cooking
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-primary-200 text-primary-100 hover:bg-primary-500 px-8 py-3"
                  >
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose RecipeAI?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform makes cooking easier, more creative, and perfectly tailored to your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center h-full">
                  <Card.Content className="p-8">
                    <div className="text-primary-600 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Generate amazing recipes in just three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Add Your Ingredients
                </h3>
                <p className="text-gray-600">
                  Tell us what ingredients you have in your kitchen, along with your dietary preferences and cuisine type.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  AI Generates Recipe
                </h3>
                <p className="text-gray-600">
                  Our advanced AI analyzes your inputs and creates a personalized recipe with detailed instructions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cook & Enjoy
                </h3>
                <p className="text-gray-600">
                  Follow the step-by-step instructions and enjoy your delicious, personalized meal!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Cooking?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of home cooks who are already using RecipeAI to create amazing meals.
            </p>
            <Link to="/register">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;