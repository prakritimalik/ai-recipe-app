import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Dashboard, SavedRecipes, Login, Register, RecipeDetailPage } from './pages';
import OpenAIDebugTest from './components/OpenAIDebugTest';
import DebugOpenAI from './pages/DebugOpenAI';
import './App.css';

/**
 * Main App component with routing
 * @returns {JSX.Element} App component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/saved-recipes" element={<SavedRecipes />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/debug-openai" element={<OpenAIDebugTest />} />
            <Route path="/debug-env" element={<DebugOpenAI />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;