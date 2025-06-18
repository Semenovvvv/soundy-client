import { Album } from "../types/album";
import { http } from "./http";
import authService from "./authService";

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
      const data = await http.get<GetAlbumByIdResponse>(`/album/${id}`);
      return data.album || null;
    } catch (error) {
      console.error('Ошибка при получении альбома:', error);
      return null;
    }
  },

  // Получение альбомов по ID автора
  getAlbumsByAuthor: async (authorId: string): Promise<Album[]> => {
    try {
      const data = await http.get<GetAlbumsByAuthorResponse>(`/album/author/${authorId}`);
      return data.albums || [];
    } catch (error) {
      console.error('Ошибка при получении альбомов:', error);
      return [];
    }
  },

  // Создание нового альбома
  createAlbum: async (albumData: CreateAlbumRequest): Promise<Album> => {
    try {
      // Если ID автора не передан, используем ID текущего пользователя
      if (!albumData.authorId) {
        const userId = authService.getUserId();
        if (userId) {
          albumData.authorId = userId;
        }
      }
      
      const data = await http.post<CreateAlbumResponse>('/album', albumData);
      return data.album;
    } catch (error) {
      console.error('Ошибка при создании альбома:', error);
      throw error;
    }
  }
};

export default albumService;
