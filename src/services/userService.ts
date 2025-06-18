import { User } from '../types/user';
import { http } from './http';

// Интерфейс для обновления пользователя только с разрешенными полями
interface UserUpdateDto {
  name?: string;
  bio?: string;
  avatarUrl?: string;
}

class UserService {
  // Получить информацию о текущем пользователе
  async getCurrentUser(): Promise<User> {
    try {
      console.log('Запрос данных текущего пользователя');
      return await http.get<User>('/user/me');
    } catch (error) {
      console.error('Ошибка при получении данных текущего пользователя:', error);
      throw error;
    }
  }

  // Получить информацию о пользователе по ID
  async getUserById(userId: string): Promise<User> {
    try {
      console.log('Запрос данных пользователя по ID:', userId);
      return await http.get<User>(`/user/${userId}`);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      throw error;
    }
  }

  // Обновить данные текущего пользователя
  async updateCurrentUser(userData: Partial<User>): Promise<User> {
    try {
      return await http.put<User>('/user/me', userData);
    } catch (error) {
      console.error('Ошибка при обновлении профиля текущего пользователя:', error);
      throw error;
    }
  }

  // Обновить данные пользователя
  async updateUser(userId: string, userData: UserUpdateDto): Promise<User> {
    try {
      return await http.put<User>(`/user/${userId}`, userData);
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
      throw error;
    }
  }
}

export default new UserService();
