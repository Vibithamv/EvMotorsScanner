# Authentication Guard Implementation

## Overview
An authentication guard has been implemented to protect the Home and NewScan routes, ensuring only authenticated users can access them. The implementation uses React Context for global authentication state management and provides automatic redirection for unauthenticated users.

## Architecture

### 1. Authentication Context (`src/contexts/AuthContext.js`)
- **Purpose**: Manages global authentication state across the entire application
- **Features**:
  - Authentication status tracking
  - User information management
  - Login/logout functionality
  - Automatic token validation
  - Loading states

### 2. Authentication Guard (`src/components/AuthGuard.js`)
- **Purpose**: Protects routes by checking authentication status
- **Features**:
  - Automatic redirection to login for unauthenticated users
  - Loading spinner during authentication checks
  - Seamless integration with React Navigation

### 3. Protected Routes in Navigation (`src/navigation/index.js`)
- **Purpose**: Wraps protected routes with authentication guard
- **Protected Routes**:
  - `Home` - Main dashboard screen
  - `NewScan` - Barcode scanning screen
- **Public Routes**:
  - `Splash` - App loading screen
  - `Login` - Authentication screen

## Implementation Details

### Authentication Context
```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Validates stored token and updates auth state
  };

  const login = async (username, password) => {
    // Handles login process and updates auth state
  };

  const logout = async () => {
    // Handles logout process and clears auth state
  };
};
```

### Authentication Guard
```javascript
const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [isAuthenticated, isLoading, navigation]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the protected component
  return children;
};
```

### Protected Route Implementation
```javascript
<Stack.Screen 
  name="Home" 
  options={({ navigation }) => getHeaderOptions(navigation, {
    headerBackVisible: false
  })}
>
  {() => (
    <ProtectedRoute>
      <HomeScreen />
    </ProtectedRoute>
  )}
</Stack.Screen>
```

## User Flow

### 1. App Launch
1. App starts with `AuthProvider` wrapping the entire navigation
2. `AuthContext` automatically checks stored authentication token
3. If token exists and is valid → User is marked as authenticated
4. If no token or invalid → User is marked as unauthenticated

### 2. Accessing Protected Routes
1. User navigates to Home or NewScan
2. `AuthGuard` checks authentication status
3. **If authenticated**: Route renders normally
4. **If not authenticated**: User is automatically redirected to Login screen

### 3. Login Process
1. User enters credentials on Login screen
2. `AuthContext.login()` is called
3. On successful login:
   - Token is stored in AsyncStorage
   - Authentication state is updated
   - User is redirected to Home screen

### 4. Logout Process
1. User clicks logout button in header
2. `AuthContext.logout()` is called
3. Token is removed from AsyncStorage
4. Authentication state is cleared
5. User is redirected to Login screen

## Security Features

### 1. Automatic Token Validation
- Token is validated on app startup
- Invalid or expired tokens are automatically cleared
- User is redirected to login if token is invalid

### 2. Route Protection
- Protected routes cannot be accessed without authentication
- Automatic redirection prevents unauthorized access
- Navigation history is reset to prevent back navigation to protected routes

### 3. State Management
- Authentication state is centralized and consistent
- No authentication state can be bypassed
- Loading states prevent race conditions

## Integration Points

### 1. Login Screen (`src/screens/login.js`)
- Uses `useAuth()` hook for login functionality
- Automatically redirects to Home on successful login
- Error handling for failed login attempts

### 2. Header Component (`src/components/HeaderWithLogout.js`)
- Uses `useAuth()` hook for logout functionality
- Provides logout confirmation dialog
- Automatically redirects to Login on logout

### 3. Network Service (`src/services/NetworkService.js`)
- Automatically attaches authentication tokens to API requests
- No changes needed - works seamlessly with existing implementation

## Benefits

### 1. Security
- **Route Protection**: Unauthorized users cannot access protected screens
- **Automatic Redirection**: Seamless user experience with proper navigation flow
- **Token Management**: Secure token storage and validation

### 2. User Experience
- **Seamless Navigation**: Users are automatically redirected based on auth status
- **Loading States**: Clear feedback during authentication checks
- **Consistent State**: Authentication state is consistent across the entire app

### 3. Developer Experience
- **Centralized Auth**: All authentication logic is in one place
- **Easy Integration**: Simple to add authentication to new routes
- **Type Safety**: Context provides type-safe authentication state

## Usage Examples

### Adding Authentication to a New Route
```javascript
<Stack.Screen 
  name="NewProtectedRoute" 
  options={({ navigation }) => getHeaderOptions(navigation)}
>
  {() => (
    <ProtectedRoute>
      <NewProtectedScreen />
    </ProtectedRoute>
  )}
</Stack.Screen>
```

### Using Authentication in Components
```javascript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { isAuthenticated, user, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return (
    <View>
      <Text>Welcome, {user?.username}!</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
};
```

## Testing Considerations

### 1. Unit Tests
- Test `AuthContext` state management
- Test `AuthGuard` redirection logic
- Test login/logout functionality

### 2. Integration Tests
- Test complete authentication flow
- Test route protection
- Test token persistence

### 3. E2E Tests
- Test user login and navigation to protected routes
- Test logout and redirection
- Test authentication state persistence across app restarts

## Conclusion

The authentication guard implementation provides a robust, secure, and user-friendly way to protect routes in the React Native application. It ensures that only authenticated users can access sensitive screens while providing a seamless user experience with automatic redirections and proper state management.
