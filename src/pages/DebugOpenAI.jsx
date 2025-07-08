import React, { useState } from 'react';

const DebugOpenAI = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testEnvVars = () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const result = {
      apiKeyExists: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyStart: apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND',
      allEnvVars: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
    };
    setResult(JSON.stringify(result, null, 2));
  };

  const testOpenAI = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        setResult('ERROR: VITE_OPENAI_API_KEY not found in environment variables');
        setLoading(false);
        return;
      }

      console.log('Testing OpenAI with key:', apiKey.substring(0, 10) + '...');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Say hello' }],
          max_tokens: 5
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setResult(`ERROR ${response.status}: ${errorText}`);
      } else {
        const data = await response.json();
        console.log('Success response:', data);
        setResult(`SUCCESS: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setResult(`FETCH ERROR: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>OpenAI Debug Tool</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testEnvVars} style={{ marginRight: '10px', padding: '10px' }}>
          Check Environment Variables
        </button>
        <button onClick={testOpenAI} disabled={loading} style={{ padding: '10px' }}>
          {loading ? 'Testing...' : 'Test OpenAI API'}
        </button>
      </div>

      <pre style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        border: '1px solid #ddd',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
      }}>
        {result || 'Click a button to start testing...'}
      </pre>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Instructions:</p>
        <ol>
          <li>First click "Check Environment Variables" to see if VITE_OPENAI_API_KEY is loaded</li>
          <li>Then click "Test OpenAI API" to test the actual API call</li>
          <li>Check browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugOpenAI;