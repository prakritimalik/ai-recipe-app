# RecipeAI - AI-Powered Recipe Generator

A modern React application that generates personalized recipes using OpenAI's API based on your available ingredients, cuisine preferences, and dietary restrictions. Built with React, Firebase, and Tailwind CSS.

## 🌟 Features

- **AI-Powered Recipe Generation**: Create personalized recipes using OpenAI's GPT models
- **User Authentication**: Secure login/signup with Firebase Auth
- **Recipe Management**: Save, organize, and manage your favorite recipes
- **Smart Search & Filtering**: Find recipes by ingredients, cuisine, or dietary restrictions
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Data**: Cloud Firestore for real-time recipe syncing
- **Modern UI**: Clean, accessible interface built with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RecipeApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys and configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Card)
│   ├── layout/         # Layout components (Header, Footer, Layout)
│   ├── recipe/         # Recipe-specific components
│   └── auth/           # Authentication components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── services/           # External service integrations
├── utils/              # Utility functions and constants
└── styles/             # Global styles and CSS
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Copy your Firebase configuration to `.env`

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env` file
3. **Important**: In production, make API calls from your backend for security

## 📱 Usage

### Generating Recipes

1. **Add Ingredients**: List what you have in your kitchen
2. **Set Preferences**: Choose cuisine type, dietary restrictions, cooking time
3. **Generate**: Click "Generate Recipe" to create your personalized recipe
4. **Save**: Save recipes you love to your personal collection

### Managing Recipes

- **View Saved Recipes**: Access all your saved recipes in the "Saved Recipes" page
- **Search & Filter**: Find specific recipes by ingredients, cuisine, or name
- **Recipe Details**: View full recipes with ingredients and step-by-step instructions

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check for linting errors
npm run lint:fix     # Fix linting errors automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🎨 Styling

This project uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable UI components with consistent styling
- **Dark Mode Ready**: Easy to implement with Tailwind's dark mode support

## 🔒 Security Features

- **Environment Variables**: Sensitive data stored in environment variables
- **Firebase Auth**: Secure user authentication
- **Firestore Rules**: Database security rules (configure in Firebase Console)
- **Input Validation**: Client-side and server-side validation

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | ✅ |
| `VITE_OPENAI_API_KEY` | OpenAI API key | ✅ |
| `VITE_OPENAI_ORGANIZATION` | OpenAI organization ID | ❌ |

## 📚 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **AI**: OpenAI GPT API
- **Icons**: Lucide React
- **Code Quality**: ESLint, Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Build fails with Tailwind errors**
- Make sure `tailwind.config.js` and `postcss.config.js` are properly configured
- Verify Tailwind directives are imported in `src/index.css`

**Firebase connection issues**
- Check that all Firebase environment variables are set correctly
- Verify Firebase project configuration in the console

**OpenAI API errors**
- Ensure API key is valid and has sufficient credits
- Check rate limits and usage quotas

**Authentication not working**
- Verify Firebase Auth is enabled for Email/Password
- Check Firebase Auth domain configuration

### Getting Help

- Check the [Issues](link-to-issues) page for common problems
- Create a new issue if you encounter bugs
- Reach out for feature requests or questions

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Firebase for backend services
- Tailwind CSS for the styling framework
- React team for the amazing framework
- All contributors and testers

---

Made with ❤️ for home cooks everywhere