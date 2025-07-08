import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }
    
    console.log('OpenAI API key found, length:', openaiApiKey.length)

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    // Parse the request body
    const requestBody = await req.json()
    console.log('Request body received:', requestBody)
    
    const { ingredients, cuisine, dietaryRestrictions, cookingTime, servings, difficulty } = requestBody

    // Validate required fields
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      console.error('Invalid ingredients:', ingredients)
      throw new Error('Ingredients are required')
    }
    
    console.log('Validated ingredients:', ingredients)

    // Build the recipe prompt
    const prompt = buildRecipePrompt({
      ingredients,
      cuisine,
      dietaryRestrictions,
      cookingTime,
      servings,
      difficulty
    })

    // Make OpenAI API call
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
    })

    const response = completion.choices[0].message.content
    
    // Parse the JSON response
    const recipesData = JSON.parse(response)
    
    // Handle both single recipe and multiple recipes response format
    const recipes = recipesData.recipes || [recipesData]
    
    // Add metadata to each recipe
    const processedRecipes = recipes.map((recipe: any) => ({
      ...recipe,
      id: generateRecipeId(),
      createdAt: new Date().toISOString(),
      generatedBy: 'openai',
      imageUrl: generateFallbackImageUrl(recipe)
    }))

    return new Response(
      JSON.stringify({ recipes: processedRecipes }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error generating recipe:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate recipe',
        details: error instanceof Error ? error.stack : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

/**
 * Build the recipe generation prompt
 */
function buildRecipePrompt(params: any) {
  const { ingredients, cuisine, dietaryRestrictions, cookingTime, servings, difficulty } = params

  let prompt = `Generate 4 different recipe options using these ingredients: ${ingredients.join(', ')}.

Please return a JSON object with this exact structure:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "description": "Brief description of the dish",
      "cuisine": "Type of cuisine",
      "prepTime": "15 min",
      "cookTime": "30 min",
      "totalTime": "45 min",
      "servings": 4,
      "difficulty": "medium",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "nutrition": {
        "calories": 350,
        "protein": "25g",
        "carbs": "30g",
        "fat": "15g"
      },
      "tags": ["tag1", "tag2"]
    }
  ]
}`

  // Add cuisine preference
  if (cuisine && cuisine !== 'Any') {
    prompt += `\n\nCuisine preference: ${cuisine}`
  }

  // Add dietary restrictions
  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    prompt += `\n\nDietary restrictions: ${dietaryRestrictions.join(', ')}`
  }

  // Add cooking time constraint
  if (cookingTime) {
    prompt += `\n\nPreferred cooking time: around ${cookingTime} minutes`
  }

  // Add servings
  if (servings) {
    prompt += `\n\nNumber of servings: ${servings}`
  }

  // Add difficulty level
  if (difficulty) {
    prompt += `\n\nDifficulty level: ${difficulty}`
  }

  prompt += `\n\nEnsure each recipe:
- Uses the provided ingredients as main components
- Includes realistic prep and cook times
- Has clear, step-by-step instructions
- Provides nutritional information
- Is practical and achievable for home cooking
- Has variety in cooking methods and flavors

Return ONLY the JSON object, no additional text.`

  return prompt
}

/**
 * Generate a unique recipe ID
 */
function generateRecipeId() {
  return `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate fallback image URL
 */
function generateFallbackImageUrl(recipe: any) {
  // Use a generic food image for now
  return 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
}