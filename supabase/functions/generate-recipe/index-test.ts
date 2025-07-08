import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    console.log('🔍 Function started')
    
    // Check if OpenAI API key exists
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('🔑 OpenAI API key exists:', !!openaiApiKey)
    console.log('🔑 OpenAI API key length:', openaiApiKey?.length || 0)
    
    if (!openaiApiKey) {
      console.error('❌ OpenAI API key not found')
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured in environment variables',
          debug: 'Check Supabase Edge Function settings'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // Parse request body
    const requestBody = await req.json()
    console.log('📦 Request body:', requestBody)

    // Return a simple test response first
    return new Response(
      JSON.stringify({ 
        message: 'Function is working! OpenAI key found.',
        keyLength: openaiApiKey.length,
        requestReceived: requestBody
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('💥 Function error:', error)
    console.error('💥 Error stack:', error.stack)
    console.error('💥 Error message:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        stack: error.stack,
        type: error.constructor.name
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})