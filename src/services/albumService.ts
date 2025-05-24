import { Album } from "../types/album";
import authService from "./authService";
import config from "../config";

const API_URL = config.API_URL;

interface CreateAlbumRequest {
  title: string;
  avatarUrl: string;
  authorId?: string; // Если authorId не передан, API должен использовать текущего пользователя
}

interface CreateAlbumResponse {
  album: Album;
}

interface GetAlbumsByAuthorResponse {
  albums: Album[];
}

interface GetAlbumByIdResponse {
  album: Album;
}

const albumService = {
  // Получение альбома по ID
  getAlbumById: async (id: string): Promise<Album | null> => {
    try {
      const response = await fetch(`${API_URL}/album/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при получении альбома');
      }
      
      const data = await response.json() as GetAlbumByIdResponse;
      return data.album || null;
    } catch (error) {
      console.error('Ошибка при получении альбома:', error);
      return null;
    }
  },


  // Получение альбомов по ID автора
  getAlbumsByAuthor: async (authorId: string): Promise<Album[]> => {
    try {
      const response = await fetch(`${API_URL}/album/author/${authorId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при получении альбомов');
      }
      
      const data = await response.json() as GetAlbumsByAuthorResponse;
      return data.albums || [];
    } catch (error) {
      console.error('Ошибка при получении альбомов:', error);
      return [];
    }
  },

  // Создание нового альбома
  createAlbum: async (albumData: CreateAlbumRequest): Promise<Album> => {
    try {
      const accessToken = authService.getAccessToken();
      
      if (!accessToken) {
        throw new Error('Пользователь не авторизован');
      }

      // Если ID автора не передан, используем ID текущего пользователя
      if (!albumData.authorId) {
        const userId = authService.getUserId();
        if (userId) {
          albumData.authorId = userId;
        }
      }
      
      const response = await fetch(`${API_URL}/album`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(albumData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании альбома');
      }
      
      const data = await response.json() as CreateAlbumResponse;
      return data.album;
    } catch (error) {
      console.error('Ошибка при создании альбома:', error);
      throw error;
    }
  }
};

export default albumService;
