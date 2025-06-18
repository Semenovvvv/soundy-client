import { http } from './http';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

interface RegisterResponse {
  message: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

class AuthService {
  // Login user
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      return await http.post<LoginResponse>('/auth/signin', loginData, true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register user
  async register(registerData: RegisterRequest): Promise<RegisterResponse> {
    try {
      return await http.post<RegisterResponse>('/auth/signup', registerData, true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      return await http.post<RefreshTokenResponse>('/auth/refresh-token', { refreshToken }, true);
    } catch (error) {
      console.error('Token refresh error:', error);
      this.removeAuth();
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.warn('No refresh token found for logout');
        this.removeAuth();
        return;
      }
      
      await http.post('/auth/signout', { refreshToken });
      this.removeAuth();
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove auth data even if the request fails
      this.removeAuth();
      throw error;
    }
  }

  // Save tokens to localStorage
  saveAuth(userId: string, accessToken: string, refreshToken: string): void {
    localStorage.setItem('userId', userId);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Remove tokens from localStorage
  removeAuth(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Get user ID
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}

export default new AuthService(); 