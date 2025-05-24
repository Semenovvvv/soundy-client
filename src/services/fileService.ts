import config from '../config';
import authService from './authService';

const API_URL = config.API_URL;

class FileService {
  // Загрузка изображения
  async uploadImage(file: File): Promise<string> {
    try {
      const accessToken = authService.getAccessToken();
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/file/image/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при загрузке изображения');
      }
      
      const data = await response.json();
      return data.avatarUrl || data.url || data.id;
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      throw error;
    }
  }
  
  // Загрузка аудио-файла
  async uploadTrack(file: File, trackId: string): Promise<string> {
    try {
      const accessToken = authService.getAccessToken();
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', trackId);
      
      const response = await fetch(`${API_URL}/file/track/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при загрузке трека');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Ошибка при загрузке трека:', error);
      throw error;
    }
  }
}

export default new FileService(); 