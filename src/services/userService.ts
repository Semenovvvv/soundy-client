import authService from './authService';
import { User } from '../types/user';

const API_URL = 'http://localhost:8085/api';

class UserService {
  // Получить информацию о текущем пользователе
  async getCurrentUser(): Promise<User> {
    const userId = authService.getUserId();
    const accessToken = authService.getAccessToken();
    
    if (!userId || !accessToken) {
      throw new Error('Пользователь не авторизован');
    }
    
    try {
      console.log('Запрос данных текущего пользователя:', `${API_URL}/user/me`);
      const response = await fetch(`${API_URL}/user/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Проверка типа контента ответа
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Если получен не JSON, попробуем прочитать текст ошибки
        const text = await response.text();
        console.error('Ошибка API (не JSON):', text.substring(0, 100) + '...');
        throw new Error(`Сервер вернул неверный формат данных: ${contentType || 'неизвестный формат'}`);
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Не удалось получить информацию о пользователе');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при выполнении запроса getCurrentUser:', error);
      throw error;
    }
  }

  // Получить информацию о пользователе по ID
  async getUserById(userId: string): Promise<User> {
    const accessToken = authService.getAccessToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    try {
      console.log('Запрос данных пользователя по ID:', `${API_URL}/user/${userId}`);
      const response = await fetch(`${API_URL}/user/${userId}`, {
        method: 'GET',
        headers
      });

      // Проверка типа контента ответа
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Если получен не JSON, попробуем прочитать текст ошибки
        const text = await response.text();
        console.error('Ошибка API (не JSON):', text.substring(0, 100) + '...');
        throw new Error(`Сервер вернул неверный формат данных: ${contentType || 'неизвестный формат'}`);
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Не удалось получить информацию о пользователе');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при выполнении запроса getUserById:', error);
      throw error;
    }
  }

  // Обновить данные текущего пользователя
  async updateCurrentUser(userData: Partial<User>): Promise<User> {
    const accessToken = authService.getAccessToken();
    
    if (!accessToken) {
      throw new Error('Пользователь не авторизован');
    }
    
    const response = await fetch(`${API_URL}/user/me`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Не удалось обновить профиль');
    }
    
    return await response.json();
  }
}

export default new UserService();
