import { http } from './http';

interface FileUploadResponse {
  avatarUrl?: string;
  url?: string;
  id?: string;
}

class FileService {
  // Загрузка изображения
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const data = await http.upload<FileUploadResponse>('/file/image/upload', formData, false);
      return data.avatarUrl || data.url || data.id || '';
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      throw error;
    }
  }

  // Загрузка аудио-файла
  async uploadTrack(file: File, trackId: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', trackId);

      const data = await http.upload<{ url: string }>('/file/track/upload', formData, false);
      return data.url;
    } catch (error) {
      console.error('Ошибка при загрузке трека:', error);
      throw error;
    }
  }
}

export default new FileService();