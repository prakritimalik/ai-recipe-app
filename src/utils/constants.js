// App constants
export const APP_NAME = 'RecipeAI';
export const APP_VERSION = '1.0.0';

// Recipe constants
export const CUISINE_TYPES = [
  'Any', 'Italian', 'Mexican', 'Chinese', 'Indian', 'Mediterranean', 
  'French', 'Japanese', 'Thai', 'American', 'Korean', 'Vietnamese',
  'Middle Eastern', 'Spanish', 'Greek', 'Brazilian', 'German'
];

export const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 
  'Low-Carb', 'High-Protein', 'Nut-Free', 'Soy-Free', 'Paleo',
  'Low-Sodium', 'Sugar-Free'
];

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

export const COOKING_TIME_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
  { value: '180', label: '3+ hours' }
];

export const SERVING_OPTIONS = [
  { value: '1', label: '1 person' },
  { value: '2', label: '2 people' },
  { value: '4', label: '4 people' },
  { value: '6', label: '6 people' },
  { value: '8', label: '8 people' },
  { value: '12', label: '12+ people' }
];

// Supabase table names
export const TABLES = {
  RECIPES: 'saved_recipes'
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'recipeai_theme',
  LAST_SEARCH: 'recipeai_last_search',
  USER_PREFERENCES: 'recipeai_user_preferences'
};