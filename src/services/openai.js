import OpenAI from 'openai';


// Validate API key before initializing
if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('OpenAI API key is not configured. Please check your .env file.');
}

if (!import.meta.env.VITE_OPENAI_API_KEY.startsWith('sk-')) {
  throw new Error('OpenAI API key format is invalid. It should start with "sk-".');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  organization: import.meta.env.VITE_OPENAI_ORGANIZATION,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from backend
});


/**
 * Generate multiple recipes using OpenAI API
 * @param {Object} params - Recipe generation parameters
 * @param {string[]} params.ingredients - List of ingredients
 * @param {string} params.cuisine - Cuisine type
 * @param {string[]} params.dietaryRestrictions - Dietary restrictions
 * @param {string} params.cookingTime - Cooking time in minutes
 * @param {string} params.servings - Number of servings
 * @param {string} params.difficulty - Difficulty level
 * @returns {Promise<Object[]>} Array of generated recipe objects
 */
export async function generateRecipe(params) {
  try {
    
    // Build the prompt
    const prompt = buildRecipePrompt(params);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional chef AI assistant. Create detailed, practical recipes with accurate ingredients and step-by-step instructions. Always format your response as a valid JSON object with the specified structure."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    // Parse the JSON response
    const recipesData = JSON.parse(response);
    
    // Handle both single recipe and multiple recipes response format
    const recipes = recipesData.recipes || [recipesData];
    
    // Add metadata to each recipe
    const processedRecipes = await Promise.all(recipes.map(async (recipe) => {
      recipe.id = generateRecipeId();
      recipe.createdAt = new Date().toISOString();
      recipe.generatedBy = 'openai';
      
      // Generate image URL using Pexels (non-blocking)
      try {
        recipe.imageUrl = await generateRecipeImageUrl(recipe);
      } catch (error) {
        console.warn('⚠️ Image generation failed for recipe, using fallback:', error);
        recipe.imageUrl = null; // Will show placeholder
      }
      
      return recipe;
    }));
    
    return processedRecipes;
  } catch (error) {
    console.error('Error generating recipe:', error);
    console.error('Error details:', {
      status: error.status,
      code: error.code,
      type: error.type,
      message: error.message,
      error: error.error
    });
    
    // Enhanced error handling with specific error types
    if (error.status === 401) {
      throw new Error('OpenAI API authentication failed. Please check your API key configuration.');
    } else if (error.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again in a few minutes.');
    } else if (error.status === 403) {
      throw new Error('OpenAI API access denied. Please check your API key permissions.');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your internet connection and try again.');
    } else if (error instanceof SyntaxError) {
      throw new Error('Failed to parse OpenAI response. Please try again.');
    } else {
      console.error('Full error details:', {
        name: error.name,
        message: error.message,
        status: error.status,
        stack: error.stack
      });
      throw new Error(`Failed to generate recipe: ${error.message || 'Unknown error'}. Please try again.`);
    }
  }
}

/**
 * Build the recipe generation prompt
 * @param {Object} params - Recipe parameters
 * @returns {string} Formatted prompt
 */
function buildRecipePrompt(params) {
  const {
    ingredients,
    cuisine,
    dietaryRestrictions,
    cookingTime,
    servings,
    difficulty
  } = params;

  let prompt = `Create 4 different ${difficulty} recipes using the following ingredients: ${ingredients.join(', ')}.`;
  
  if (cuisine && cuisine !== 'Any') {
    prompt += ` The recipes should be ${cuisine} cuisine.`;
  }
  
  if (dietaryRestrictions.length > 0) {
    prompt += ` All recipes must be ${dietaryRestrictions.join(', ')}.`;
  }
  
  if (cookingTime) {
    prompt += ` The total cooking time for each recipe should be around ${cookingTime} minutes.`;
  }
  
  if (servings) {
    prompt += ` Each recipe should serve ${servings} people.`;
  }

  prompt += ` Please create 4 diverse recipes with different cooking methods, flavors, and presentations. Make each recipe unique and interesting.`;

  prompt += `

Please respond with a valid JSON object in the following format:
{
  "recipes": [
    {
      "title": "Recipe Name 1",
      "description": "Brief description of the dish",
      "cookingTime": ${cookingTime || 30},
      "servings": ${servings || 4},
      "difficulty": "${difficulty}",
      "cuisine": "${cuisine || 'International'}",
      "ingredients": [
        "ingredient 1 with measurements",
        "ingredient 2 with measurements"
      ],
      "instructions": [
        "Step 1 instructions",
        "Step 2 instructions"
      ],
      "nutrition": {
        "calories": 350,
        "protein": "25g",
        "carbs": "30g",
        "fat": "15g"
      }
    },
    {
      "title": "Recipe Name 2",
      "description": "Brief description of the dish",
      "cookingTime": ${cookingTime || 30},
      "servings": ${servings || 4},
      "difficulty": "${difficulty}",
      "cuisine": "${cuisine || 'International'}",
      "ingredients": [
        "ingredient 1 with measurements",
        "ingredient 2 with measurements"
      ],
      "instructions": [
        "Step 1 instructions",
        "Step 2 instructions"
      ],
      "nutrition": {
        "calories": 350,
        "protein": "25g",
        "carbs": "30g",
        "fat": "15g"
      }
    },
    {
      "title": "Recipe Name 3",
      "description": "Brief description of the dish",
      "cookingTime": ${cookingTime || 30},
      "servings": ${servings || 4},
      "difficulty": "${difficulty}",
      "cuisine": "${cuisine || 'International'}",
      "ingredients": [
        "ingredient 1 with measurements",
        "ingredient 2 with measurements"
      ],
      "instructions": [
        "Step 1 instructions",
        "Step 2 instructions"
      ],
      "nutrition": {
        "calories": 350,
        "protein": "25g",
        "carbs": "30g",
        "fat": "15g"
      }
    },
    {
      "title": "Recipe Name 4",
      "description": "Brief description of the dish",
      "cookingTime": ${cookingTime || 30},
      "servings": ${servings || 4},
      "difficulty": "${difficulty}",
      "cuisine": "${cuisine || 'International'}",
      "ingredients": [
        "ingredient 1 with measurements",
        "ingredient 2 with measurements"
      ],
      "instructions": [
        "Step 1 instructions",
        "Step 2 instructions"
      ],
      "nutrition": {
        "calories": 350,
        "protein": "25g",
        "carbs": "30g",
        "fat": "15g"
      }
    }
  ]
}`;

  return prompt;
}

/**
 * Generate a unique recipe ID
 * @returns {string} Unique recipe ID
 */
function generateRecipeId() {
  return `recipe_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate recipe image URL using Pexels API
 * @param {Object} recipe - Recipe object
 * @returns {Promise<string>} Image URL
 */
async function generateRecipeImageUrl(recipe) {
  try {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
    
    // If no API key, return a fallback
    if (!apiKey) {
      console.warn('Pexels API key not found, using fallback image');
      return null;
    }
    
    // Create search terms from recipe title and main ingredients
    let searchTerms = [];
    
    // Add recipe title (clean it up)
    if (recipe.title) {
      const cleanTitle = recipe.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
      searchTerms.push(cleanTitle);
    }
    
    // Add main ingredients (first 2)
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      const mainIngredients = recipe.ingredients
        .slice(0, 2)
        .map(ingredient => {
          // Extract the main ingredient name (before measurements, etc.)
          const cleanIngredient = ingredient
            .toLowerCase()
            .split(/[0-9]/)[0] // Remove numbers/measurements
            .replace(/[^a-z\s]/g, '') // Remove special characters
            .split(' ')[0] // Take first word
            .trim();
          return cleanIngredient;
        })
        .filter(ingredient => ingredient.length > 2); // Filter out very short words
      
      searchTerms = searchTerms.concat(mainIngredients);
    }
    
    // Create search query (prefer title, fallback to ingredients + "food")
    let searchQuery;
    if (recipe.title) {
      searchQuery = recipe.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    } else {
      searchQuery = [...searchTerms, 'food'].join(' ');
    }
    
    // Make API call to Pexels
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=15&orientation=landscape`, {
      headers: {
        'Authorization': apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the first (most relevant) image from the results
    if (data.photos && data.photos.length > 0) {
      // Take the first image (most relevant to search query)
      return data.photos[0].src.large; // Pexels returns results by relevance
    }
    
    // If no images found, try a generic "food" search
    if (searchQuery !== 'food') {
      const fallbackResponse = await fetch(`https://api.pexels.com/v1/search?query=food&per_page=15&orientation=landscape`, {
        headers: {
          'Authorization': apiKey
        }
      });
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.photos && fallbackData.photos.length > 0) {
          // Take first food image as fallback
          return fallbackData.photos[0].src.large;
        }
      }
    }
    
    return null; // No image found
  } catch (error) {
    console.error('Error fetching image from Pexels:', error);
    return null; // Return null so fallback placeholder will be used
  }
}

export { openai };