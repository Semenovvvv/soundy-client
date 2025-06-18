import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { http } from '../services/http';

// Types
interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('accessToken');

      if (userId && token) {
        try {
          // Get user data with the token
          const userData = await http.get<User>(`/user/${userId}`);
          
          setAuthState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error initializing auth state:', error);
          // Clear local storage if there's an error
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  // Login
  const login = async (loginData: LoginRequest) => {
    try {
      const response = await http.post<{
        userId: string;
        accessToken: string;
        refreshToken: string;
      }>('/auth/signin', loginData, true);

      localStorage.setItem('userId', response.userId);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Get user data
      const userData = await http.get<User>(`/user/${response.userId}`);

      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register
  const register = async (registerData: RegisterRequest) => {
    try {
      const response = await http.post<{
        userId: string;
        accessToken: string;
        refreshToken: string;
        message: string;
      }>('/auth/signup', registerData, true);

      localStorage.setItem('userId', response.userId);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Create basic user object from registration data
      const userData: User = {
        id: response.userId,
        username: registerData.username,
        email: registerData.email,
      };

      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await http.post('/auth/signout', { refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  // Get access token
  const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken');
  };

  const value = {
    ...authState,
    login,
    register,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 