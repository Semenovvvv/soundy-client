import { User } from '../types/user';
import { Album } from '../types/album';
import { Playlist } from '../types/playlist';
import config from "../config";

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
  private async fetchWithTokenRefresh(url: string, options: RequestInit): Promise<Response> {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      if (!options.headers) {
        options.headers = {};
      }
      
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      };
    }
    
    try {
      const response = await fetch(url, options);
      
      if (response.status === 401) {
        // Token has expired, try to refresh
        await this.refreshToken();
        
        // Update headers with new token
        const newAccessToken = localStorage.getItem('accessToken');
        if (newAccessToken && options.headers) {
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newAccessToken}`
          };
        }
        
        // Retry the request with the new token
        return fetch(url, options);
      }
      
      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }
  
  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await fetch(`${config.API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Force logout or redirect to login page
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      throw error;
    }
  }

  async getLatestUsers(count = 10): Promise<User[]> {
    const queryParams = new URLSearchParams({
      count: count.toString()
    });
    
    const response = await this.fetchWithTokenRefresh(`${config.API_URL}/user/latest?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: LatestUsersResponse = await response.json();
    return data.users || [];
  }
  
  async getLatestAlbums(count = 10): Promise<Album[]> {
    const queryParams = new URLSearchParams({
      count: count.toString()
    });
    
    const response = await this.fetchWithTokenRefresh(`${config.API_URL}/album/latest?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: LatestAlbumsResponse = await response.json();
    return data.albums || [];
  }
  
  async getLatestPlaylists(count = 10): Promise<Playlist[]> {
    const queryParams = new URLSearchParams({
      count: count.toString()
    });
    
    const response = await this.fetchWithTokenRefresh(`${config.API_URL}/playlist/latest?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: LatestPlaylistsResponse = await response.json();
    return data.playlists || [];
  }
}

export default new LatestService(); 