import config from "../config";

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

const API_URL = config.API_URL;

class AuthService {
  // Вход пользователя (логин)
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Отправка запроса авторизации:', `${API_URL}/auth/signin`);
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      // Проверка типа контента ответа
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Ошибка API (не JSON):', text.substring(0, 100) + '...');
        throw new Error(`Сервер вернул неверный формат данных: ${contentType || 'неизвестный формат'}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка авторизации');
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка при выполнении запроса login:', error);
      throw error;
    }
  }

  // Регистрация пользователя
  async register(registerData: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Произошла ошибка при регистрации');
    }

    return await response.json();
  }

  // Сохранение токенов в localStorage
  saveAuth(userId: string, accessToken: string, refreshToken: string): void {
    localStorage.setItem('userId', userId);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Удаление токенов (используется при выходе)
  removeAuth(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Проверка авторизации
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Получение текущего токена
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Получение ID пользователя
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Logout user (sign out)
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.warn('No refresh token found for logout');
        this.removeAuth();
        return;
      }
      
      const response = await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        console.error('Error during logout:', response.status);
      }
      
      // Always clear local auth data, even if the request fails
      this.removeAuth();
    } catch (error) {
      console.error('Error during logout:', error);
      // Still remove auth data even if the request fails
      this.removeAuth();
      throw error;
    }
  }
}

export default new AuthService(); 