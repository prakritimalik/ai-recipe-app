// Browser-specific debugging for OpenAI API issues
// This script should be run in the browser console

(function() {
  console.log('=== OpenAI API Browser Debug ===');
  
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.log('❌ This script must be run in a browser environment');
    return;
  }
  
  // Check environment variables
  console.log('\n1. Environment Variables Check:');
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    console.log('✅ import.meta.env is available');
    
    // Check for VITE_ variables
    const viteVars = {};
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        viteVars[key] = import.meta.env[key];
      }
    });
    
    console.log('VITE_ variables:', viteVars);
    
    // Check OpenAI API key
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      console.log('✅ VITE_OPENAI_API_KEY is loaded:', apiKey.substring(0, 10) + '...' + apiKey.slice(-4));
    } else {
      console.log('❌ VITE_OPENAI_API_KEY is not loaded');
    }
  } else {
    console.log('❌ import.meta.env is not available');
  }
  
  // Check if OpenAI is available
  console.log('\n2. OpenAI Library Check:');
  if (typeof OpenAI !== 'undefined') {
    console.log('✅ OpenAI is available globally');
  } else {
    console.log('⚠️ OpenAI is not available globally, trying dynamic import...');
    
    import('openai').then(({ default: OpenAI }) => {
      console.log('✅ OpenAI imported successfully');
      
      // Test OpenAI initialization
      console.log('\n3. OpenAI Client Test:');
      try {
        const client = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
        });
        console.log('✅ OpenAI client created successfully');
        
        // Test a simple API call
        console.log('\n4. API Call Test:');
        return client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Say hello" }],
          max_tokens: 5
        });
      } catch (error) {
        console.log('❌ OpenAI client creation failed:', error);
        throw error;
      }
    }).then(response => {
      console.log('✅ API call successful:', response);
    }).catch(error => {
      console.log('❌ API call failed:', error);
      
      // Analyze the error
      if (error.status === 401) {
        console.log('🔍 401 Error Analysis:');
        console.log('  - Check if API key is correct');
        console.log('  - Verify API key has not expired');
        console.log('  - Check if API key has required permissions');
      } else if (error.status === 429) {
        console.log('🔍 429 Error Analysis:');
        console.log('  - Rate limit exceeded');
        console.log('  - Wait before trying again');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('🔍 Network Error Analysis:');
        console.log('  - Check internet connection');
        console.log('  - Check if proxy/firewall is blocking requests');
        console.log('  - Try disabling ad blockers');
      } else {
        console.log('🔍 Other Error Analysis:');
        console.log('  - Full error object:', error);
      }
    });
  }
  
  // Check for CORS issues
  console.log('\n5. CORS Check:');
  fetch('https://api.openai.com/v1/models', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    }
  }).then(response => {
    console.log('✅ CORS check passed, status:', response.status);
    if (!response.ok) {
      console.log('❌ But response is not ok:', response.statusText);
    }
  }).catch(error => {
    console.log('❌ CORS check failed:', error);
    if (error.name === 'TypeError' && error.message.includes('CORS')) {
      console.log('🔍 CORS Error detected - this might be a browser security issue');
    }
  });
  
  // Check browser environment
  console.log('\n6. Browser Environment:');
  console.log('  - User Agent:', navigator.userAgent);
  console.log('  - Current URL:', window.location.href);
  console.log('  - Is HTTPS:', window.location.protocol === 'https:');
  console.log('  - Is localhost:', window.location.hostname === 'localhost');
  
  // Check for ad blockers or extensions
  console.log('\n7. Browser Extensions Check:');
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log('⚠️ Chrome extension detected - might interfere with API calls');
  }
  
  // Test basic fetch functionality
  console.log('\n8. Basic Fetch Test:');
  fetch('https://httpbin.org/json')
    .then(response => response.json())
    .then(data => {
      console.log('✅ Basic fetch works:', data);
    })
    .catch(error => {
      console.log('❌ Basic fetch failed:', error);
    });
  
  console.log('\n=== Debug completed ===');
  console.log('Check the console output above for any issues');
})();