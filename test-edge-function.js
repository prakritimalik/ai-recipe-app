// Test script for Supabase Edge Function
import { createClient } from '@supabase/supabase-js'

// Load environment variables (you'll need to update these)
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testEdgeFunction() {
  try {
    console.log('🧪 Testing Edge Function...')
    
    const testParams = {
      ingredients: ['chicken', 'rice', 'vegetables'],
      cuisine: 'Asian',
      dietaryRestrictions: [],
      cookingTime: '30',
      servings: '4',
      difficulty: 'medium'
    }

    const { data, error } = await supabase.functions.invoke('generate-recipe', {
      body: testParams
    })

    if (error) {
      console.error('❌ Error:', error)
      return
    }

    console.log('✅ Success! Generated', data.recipes.length, 'recipes')
    console.log('📋 First recipe:', data.recipes[0].title)
    
  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

// Run the test
testEdgeFunction()