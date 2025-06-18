import { User } from '../types/user';
import { Album } from '../types/album';
import { Playlist } from '../types/playlist';
import { http } from './http';

interface LatestUsersResponse {
  users: User[];
}

interface LatestAlbumsResponse {
  albums: Album[];
}

interface LatestPlaylistsResponse {
  playlists: Playlist[];
}

class LatestService {
  async getLatestUsers(count = 10): Promise<User[]> {
    try {
      const queryParams = new URLSearchParams({
        count: count.toString()
      });
      
      const data = await http.get<LatestUsersResponse>(`/user/latest?${queryParams}`);
      return data.users || [];
    } catch (error) {
      console.error('Ошибка при получении последних пользователей:', error);
      throw error;
    }
  }
  
  async getLatestAlbums(count = 10): Promise<Album[]> {
    try {
      const queryParams = new URLSearchParams({
        count: count.toString()
      });
      
      const data = await http.get<LatestAlbumsResponse>(`/album/latest?${queryParams}`);
      return data.albums || [];
    } catch (error) {
      console.error('Ошибка при получении последних альбомов:', error);
      throw error;
    }
  }
  
  async getLatestPlaylists(count = 10): Promise<Playlist[]> {
    try {
      const queryParams = new URLSearchParams({
        count: count.toString()
      });
      
      const data = await http.get<LatestPlaylistsResponse>(`/playlist/latest?${queryParams}`);
      return data.playlists || [];
    } catch (error) {
      console.error('Ошибка при получении последних плейлистов:', error);
      throw error;
    }
  }
}

export default new LatestService(); 