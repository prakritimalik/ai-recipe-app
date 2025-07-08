# OpenAI API 401 Unauthorized Error Troubleshooting Guide

## Overview
This guide helps diagnose and fix OpenAI API 401 Unauthorized errors in your Vite/React application.

## Quick Diagnostics

### 1. Use the Debug Tools
Access the debug tools to get detailed information about the issue:

- **Browser Debug Tool**: Open `/debug-openai.html` in your browser
- **React Debug Component**: Navigate to `/debug-openai` in your app
- **Environment Test**: Run `node test-env.js` in your terminal
- **Browser Console Script**: Copy and paste the contents of `debug-browser.js` into your browser console

### 2. Environment Variable Checklist

✅ **Check .env file location**
- The `.env` file must be in the root directory (same level as `package.json`)
- NOT in the `src/` directory

✅ **Check .env file format**
```bash
# Correct format
VITE_OPENAI_API_KEY=sk-proj-your-actual-key-here

# Incorrect formats
OPENAI_API_KEY=sk-proj-your-key  # Missing VITE_ prefix
VITE_OPENAI_API_KEY="sk-proj-your-key"  # Don't use quotes
VITE_OPENAI_API_KEY = sk-proj-your-key  # Don't use spaces around =
```

✅ **Verify API key format**
- Must start with `sk-proj-` (for project keys) or `sk-` (for legacy keys)
- Should be 164+ characters long
- Should not contain placeholder text like "your_api_key_here"

### 3. Development Server Restart
After changing `.env` files, you MUST restart your development server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### 4. API Key Validation
Test your API key outside the browser:

```bash
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 5
  }'
```

If this fails, the API key itself is invalid.

## Common Issues and Solutions

### Issue 1: Environment Variables Not Loading
**Symptoms**: Console shows "VITE_OPENAI_API_KEY is not set"

**Solutions**:
1. Verify `.env` file is in root directory
2. Check file has `VITE_` prefix
3. Restart development server
4. Clear browser cache
5. Check for typos in variable names

### Issue 2: API Key Format Problems
**Symptoms**: "API key format is invalid" error

**Solutions**:
1. Verify key starts with `sk-proj-` or `sk-`
2. Check for extra spaces or characters
3. Regenerate API key from OpenAI dashboard
4. Ensure no quotes around the key in `.env`

### Issue 3: Browser Security Issues
**Symptoms**: CORS errors or network failures

**Solutions**:
1. Disable browser extensions (ad blockers, etc.)
2. Try incognito/private browsing mode
3. Check browser console for additional errors
4. Verify `dangerouslyAllowBrowser: true` is set

### Issue 4: API Key Permissions
**Symptoms**: 403 Forbidden errors

**Solutions**:
1. Check API key permissions in OpenAI dashboard
2. Verify your OpenAI account has sufficient credits
3. Check if the API key has been revoked
4. Regenerate the API key

### Issue 5: Network/Proxy Issues
**Symptoms**: Network timeout or connection refused

**Solutions**:
1. Check internet connection
2. Disable VPN/proxy temporarily
3. Check corporate firewall settings
4. Try different network (mobile hotspot)

## Advanced Debugging

### Check Browser Console
Open browser DevTools (F12) and look for:
- Red error messages
- Network tab for failed requests
- Console tab for JavaScript errors

### Network Request Analysis
1. Open DevTools → Network tab
2. Try to generate a recipe
3. Look for requests to `api.openai.com`
4. Check the request headers and response

### Environment Variable Inspection
Add this to your component for debugging:

```javascript
console.log('All env vars:', import.meta.env);
console.log('OpenAI key:', import.meta.env.VITE_OPENAI_API_KEY);
```

## Step-by-Step Debugging Process

1. **Verify Environment Setup**
   - Run `node test-env.js` to check .env parsing
   - Ensure API key is correctly formatted

2. **Test API Key Externally**
   - Use cURL command to test API key
   - Verify it works outside the browser

3. **Check Browser Environment**
   - Open browser debug tool (`/debug-openai.html`)
   - Check console for environment variable loading

4. **Test in Application**
   - Navigate to `/debug-openai` in your app
   - Run the OpenAI connection test

5. **Analyze Console Logs**
   - Look for detailed error messages
   - Check network tab for request details

## Common Error Messages and Solutions

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "VITE_OPENAI_API_KEY is not set" | Environment variable not loaded | Check .env file location and restart server |
| "API key format is invalid" | Wrong key format | Verify key starts with sk- |
| "401 Unauthorized" | Invalid API key | Regenerate API key from OpenAI dashboard |
| "403 Forbidden" | Permission denied | Check API key permissions and account credits |
| "429 Rate Limit" | Too many requests | Wait and try again |
| "Network error" | Connection issues | Check internet/firewall/proxy settings |

## Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Test API keys regularly**
4. **Monitor API usage and costs**
5. **Implement proper error handling**
6. **Use HTTPS in production**
7. **Consider using a backend proxy for production**

## Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vite Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)
- [OpenAI API Key Management](https://platform.openai.com/api-keys)

## Getting Help

If you're still experiencing issues:

1. Run all debug tools and collect the output
2. Check the browser console for errors
3. Test the API key with cURL
4. Document the exact error messages
5. Note your browser version and operating system

This information will help identify the root cause of the 401 Unauthorized error.