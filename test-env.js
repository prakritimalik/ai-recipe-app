// Simple test to verify environment variables are loaded correctly
// Run this with: node test-env.js

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // Read the .env file
  const envPath = join(__dirname, '.env');
  const envContent = readFileSync(envPath, 'utf8');
  
  console.log('=== .env File Content ===');
  console.log(envContent);
  
  // Parse environment variables
  const envVars = {};
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      envVars[key] = value;
    }
  });
  
  console.log('\n=== Parsed Environment Variables ===');
  Object.entries(envVars).forEach(([key, value]) => {
    if (key.includes('API_KEY') || key.includes('SECRET')) {
      console.log(`${key}: ${value.substring(0, 10)}...${value.slice(-4)}`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });
  
  // Check OpenAI API key specifically
  console.log('\n=== OpenAI API Key Analysis ===');
  const openaiKey = envVars.VITE_OPENAI_API_KEY;
  
  if (!openaiKey) {
    console.log('❌ VITE_OPENAI_API_KEY is not defined');
  } else {
    console.log(`✅ VITE_OPENAI_API_KEY is defined`);
    console.log(`   Length: ${openaiKey.length} characters`);
    console.log(`   Starts with 'sk-': ${openaiKey.startsWith('sk-') ? 'Yes' : 'No'}`);
    console.log(`   Contains placeholders: ${openaiKey.includes('your_') || openaiKey.includes('replace_') ? 'Yes' : 'No'}`);
    console.log(`   Format: ${openaiKey.substring(0, 10)}...${openaiKey.slice(-4)}`);
  }
  
  // Test cURL command generation
  if (openaiKey && openaiKey.startsWith('sk-')) {
    console.log('\n=== Test cURL Command ===');
    console.log(`curl -X POST https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${openaiKey}" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 5
  }'`);
  }
  
} catch (error) {
  console.error('Error reading .env file:', error.message);
}