import { Track } from '../types/track';
import { Album } from '../types/album';
import { Playlist } from '../types/playlist';
import { User } from '../types/user';
import { http } from './http';

interface SearchResponse {
  pattern: string;
  pageSize: number;
  pageNum: number;
  tracks?: Track[];
  albums?: Album[];
  playlists?: Playlist[];
  users?: User[];
}

interface SearchParams {
  pattern: string;
  pageNum?: number;
  pageSize?: number;
}

class SearchService {
  
  async searchAll(params: SearchParams): Promise<SearchResponse> {
    try {
      const { pattern, pageNum = 1, pageSize = 10 } = params;
      
      const queryParams = new URLSearchParams({
        pattern,
        pageNumber: pageNum.toString(),
        pageSize: pageSize.toString()
      });
      
      return await http.get<SearchResponse>(`/search?${queryParams}`);
    } catch (error) {
      console.error('Ошибка при поиске:', error);
      throw error;
    }
  }
  
  async searchTracks(params: SearchParams): Promise<SearchResponse> {
    try {
      const { pattern, pageNum = 1, pageSize = 10 } = params;
      
      const queryParams = new URLSearchParams({
        pattern,
        pageNumber: pageNum.toString(),
        pageSize: pageSize.toString()
      });
      
      return await http.get<SearchResponse>(`/track/search?${queryParams}`);
    } catch (error) {
      console.error('Ошибка при поиске треков:', error);
      throw error;
    }
  }
  
  async searchAlbums(params: SearchParams): Promise<SearchResponse> {
    try {
      const { pattern, pageNum = 1, pageSize = 10 } = params;
      
      const queryParams = new URLSearchParams({
        pattern,
        pageNumber: pageNum.toString(),
        pageSize: pageSize.toString()
      });
      
      return await http.get<SearchResponse>(`/album/search?${queryParams}`);
    } catch (error) {
      console.error('Ошибка при поиске альбомов:', error);
      throw error;
    }
  }
  
  async searchPlaylists(params: SearchParams): Promise<SearchResponse> {
    try {
      const { pattern, pageNum = 1, pageSize = 10 } = params;
      
      const queryParams = new URLSearchParams({
        pattern,
        pageNumber: pageNum.toString(),
        pageSize: pageSize.toString()
      });
      
      return await http.get<SearchResponse>(`/playlist/search?${queryParams}`);
    } catch (error) {
      console.error('Ошибка при поиске плейлистов:', error);
      throw error;
    }
  }
  
  async searchUsers(params: SearchParams): Promise<SearchResponse> {
    try {
      const { pattern, pageNum = 1, pageSize = 10 } = params;
      
      const queryParams = new URLSearchParams({
        pattern,
        pageNumber: pageNum.toString(),
        pageSize: pageSize.toString()
      });
      
      return await http.get<SearchResponse>(`/user/search?${queryParams}`);
    } catch (error) {
      console.error('Ошибка при поиске пользователей:', error);
      throw error;
    }
  }
}

export default new SearchService(); 