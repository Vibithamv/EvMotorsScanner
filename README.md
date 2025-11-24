# EvMotorsScanner

A React Native application for EV Motors scanning functionality with AWS Cognito authentication.

## Project Structure

```
EvMotorsScanner/
├── docs/                          # Documentation and examples
│   ├── AssetManager.example.js    # AssetManager usage examples
│   ├── HeaderWithLogout.example.js # Header component examples
│   └── README.md                  # Documentation guide
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── HeaderWithLogout.js   # Header with logout functionality
│   │   └── LoadingSpinner.js     # Loading spinner component
│   ├── config/                   # Configuration files
│   │   └── cognito.js            # AWS Cognito configuration
│   ├── navigation/               # Navigation setup
│   │   └── index.js              # Main navigation configuration
│   ├── screens/                  # App screens
│   │   ├── home.js               # Home screen
│   │   ├── login.js              # Login screen
│   │   ├── newscan.js            # New scan screen
│   │   └── SplashScreen.js       # Splash screen with auth check
│   ├── services/                 # Business logic services
│   │   └── AuthService.js        # Authentication service
│   └── utils/                    # Utility functions
│       ├── AssetManager.js       # Centralized asset management
│       └── AuthUtils.js          # Authentication utilities
├── assets/                       # Static assets
│   ├── fonts/                    # Custom fonts
│   └── *.png                     # Images and icons
├── App.js                        # Main app component
└── package.json                  # Dependencies and scripts
```

## Features

- **AWS Cognito Authentication**: Secure login with username/password
- **Splash Screen**: Automatic authentication check on app launch
- **Asset Management**: Centralized management of images, fonts, and styles
- **Responsive UI**: Modern design with consistent styling
- **Navigation**: Stack-based navigation with logout functionality
- **Loading States**: Proper loading indicators and error handling

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure AWS Cognito**
   - Update `src/config/cognito.js` with your Cognito settings
   - Ensure your Cognito User Pool is properly configured

3. **Start the App**
   ```bash
   npm start
   ```

## Key Components

### AssetManager
Centralized asset management for consistent styling across the app.
- Images, fonts, colors, and common styles
- Helper functions for dynamic asset access
- Type-safe asset references

### AuthService
Handles all authentication operations.
- Login/logout functionality
- Token management
- Authentication state checking

### HeaderWithLogout
Reusable header component with logout functionality.
- Power button icon for logout
- Confirmation dialog
- Consistent styling across screens

## Documentation

See the `docs/` folder for detailed usage examples and best practices.

## Dependencies

- React Native
- Expo
- React Navigation
- React Native Paper
- AWS Cognito (via direct API calls)
- AsyncStorage

## Development

The app uses a service-oriented architecture with:
- Centralized asset management
- Reusable components
- Consistent styling patterns
- Proper error handling
- Clean separation of concerns
