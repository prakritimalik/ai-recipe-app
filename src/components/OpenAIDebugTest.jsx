import React, { useState, useEffect } from 'react';

/**
 * OpenAI Debug Test Component
 * This component helps debug OpenAI API integration issues
 */
const OpenAIDebugTest = () => {
  const [debugInfo, setDebugInfo] = useState({
    envVars: {},
    apiKeyStatus: 'checking',
    testResult: null,
    isLoading: false
  });

  useEffect(() => {
    // Check environment variables on mount
    checkEnvironmentVariables();
  }, []);

  const checkEnvironmentVariables = () => {
    const envVars = {};
    
    // Get all VITE_ environment variables
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        envVars[key] = import.meta.env[key];
      }
    });

    // Check API key specifically
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    let apiKeyStatus = 'missing';
    
    if (apiKey) {
      if (apiKey.startsWith('sk-')) {
        apiKeyStatus = 'valid';
      } else {
        apiKeyStatus = 'invalid';
      }
    }

    setDebugInfo(prev => ({
      ...prev,
      envVars,
      apiKeyStatus
    }));
  };

  const testOpenAIConnection = async () => {
    setDebugInfo(prev => ({ ...prev, isLoading: true, testResult: null }));

    try {
      // Import OpenAI dynamically
      const { default: OpenAI } = await import('openai');
      
      console.log('OpenAI imported successfully');
      console.log('API Key:', import.meta.env.VITE_OPENAI_API_KEY ? 'Present' : 'Missing');
      console.log('Organization:', import.meta.env.VITE_OPENAI_ORGANIZATION ? 'Present' : 'Missing');

      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        organization: import.meta.env.VITE_OPENAI_ORGANIZATION,
        dangerouslyAllowBrowser: true
      });

      console.log('OpenAI client created');

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Say 'Hello World' in exactly two words."
          }
        ],
        max_tokens: 10
      });

      console.log('OpenAI response:', response);

      setDebugInfo(prev => ({
        ...prev,
        testResult: {
          success: true,
          message: 'OpenAI API connection successful!',
          response: response.choices[0].message.content
        }
      }));
    } catch (error) {
      console.error('OpenAI Test Error:', error);
      
      let errorMessage = 'Unknown error occurred';
      let errorDetails = {};

      if (error.status) {
        switch (error.status) {
          case 401:
            errorMessage = 'Authentication failed - Invalid API key';
            break;
          case 403:
            errorMessage = 'Forbidden - Check API key permissions';
            break;
          case 429:
            errorMessage = 'Rate limit exceeded - Try again later';
            break;
          default:
            errorMessage = `API Error: ${error.status} - ${error.message}`;
        }
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error - Check your internet connection';
      } else {
        errorMessage = error.message || 'Unknown error';
      }

      errorDetails = {
        name: error.name,
        message: error.message,
        status: error.status,
        stack: error.stack
      };

      setDebugInfo(prev => ({
        ...prev,
        testResult: {
          success: false,
          message: errorMessage,
          error: errorDetails
        }
      }));
    } finally {
      setDebugInfo(prev => ({ ...prev, isLoading: false }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">OpenAI Debug Test</h2>
      
      {/* Environment Variables Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Environment Variables</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify(debugInfo.envVars, null, 2)}
          </pre>
        </div>
      </div>

      {/* API Key Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">API Key Status</h3>
        <div className={`p-4 rounded-lg ${
          debugInfo.apiKeyStatus === 'valid' 
            ? 'bg-green-50 border border-green-200' 
            : debugInfo.apiKeyStatus === 'invalid'
            ? 'bg-red-50 border border-red-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <p className={`font-medium ${
            debugInfo.apiKeyStatus === 'valid' 
              ? 'text-green-800' 
              : debugInfo.apiKeyStatus === 'invalid'
              ? 'text-red-800'
              : 'text-yellow-800'
          }`}>
            {debugInfo.apiKeyStatus === 'valid' && '✓ API key format looks correct'}
            {debugInfo.apiKeyStatus === 'invalid' && '✗ API key format is incorrect'}
            {debugInfo.apiKeyStatus === 'missing' && '⚠ API key is missing'}
          </p>
          {debugInfo.envVars.VITE_OPENAI_API_KEY && (
            <p className="text-sm text-gray-600 mt-2">
              Key: {debugInfo.envVars.VITE_OPENAI_API_KEY.substring(0, 10)}...{debugInfo.envVars.VITE_OPENAI_API_KEY.slice(-4)}
            </p>
          )}
        </div>
      </div>

      {/* Test Connection Button */}
      <div className="mb-6">
        <button
          onClick={testOpenAIConnection}
          disabled={debugInfo.isLoading || debugInfo.apiKeyStatus !== 'valid'}
          className={`px-6 py-3 rounded-lg font-medium ${
            debugInfo.isLoading || debugInfo.apiKeyStatus !== 'valid'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {debugInfo.isLoading ? 'Testing...' : 'Test OpenAI Connection'}
        </button>
      </div>

      {/* Test Results */}
      {debugInfo.testResult && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Results</h3>
          <div className={`p-4 rounded-lg ${
            debugInfo.testResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`font-medium mb-2 ${
              debugInfo.testResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {debugInfo.testResult.message}
            </p>
            
            {debugInfo.testResult.success && debugInfo.testResult.response && (
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-700">
                  <strong>API Response:</strong> {debugInfo.testResult.response}
                </p>
              </div>
            )}
            
            {!debugInfo.testResult.success && debugInfo.testResult.error && (
              <div className="bg-white p-3 rounded border mt-2">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Error Details:</strong>
                </p>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {JSON.stringify(debugInfo.testResult.error, null, 2)}
                </pre>
                <button 
                  onClick={() => copyToClipboard(JSON.stringify(debugInfo.testResult.error, null, 2))}
                  className="mt-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                >
                  Copy Error Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Troubleshooting Tips */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Troubleshooting Tips</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Make sure your .env file is in the root directory</li>
            <li>• Verify the API key starts with "sk-" and is not a placeholder</li>
            <li>• Restart your development server after changing .env</li>
            <li>• Check browser console for additional error messages</li>
            <li>• Test the API key with cURL to verify it works outside the browser</li>
            <li>• Ensure no proxy or firewall is blocking the OpenAI API</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OpenAIDebugTest;