import { mockAlbums } from "../mocks/albumMock";
import { Album } from "../types/album";
import authService from "./authService";

const API_URL = 'http://localhost:8085/api';

interface CreateAlbumRequest {
  title: string;
  avatarUrl: string;
  authorId?: string; // Если authorId не передан, API должен использовать текущего пользователя
}

interface CreateAlbumResponse {
  album: Album;
}

const albumService = {
  getAlbumByIdMock: async (id: string): Promise<Album | null> => {
    return mockAlbums.find((a) => a.id === id) || null;
  },

  searchAlbumByName: async (name: string): Promise<Album[]> => {
    if (!name.trim()) {
      return mockAlbums;
    }

    const lowerCaseQuery = name.toLowerCase();

    const filteredAlbums = mockAlbums.filter((album) =>
      album.title.toLowerCase().includes(lowerCaseQuery)
    );

    return filteredAlbums;
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
