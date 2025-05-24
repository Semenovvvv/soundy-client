import { Track } from '../types/track';
import { Album } from '../types/album';
import { Playlist } from '../types/playlist';
import { User } from '../types/user';
import config from "../config";

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

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

class SearchService {
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
      
      const data: TokenResponse = await response.json();
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
  
  async searchAll(params: SearchParams): Promise<SearchResponse> {
    const { pattern, pageNum = 1, pageSize = 10 } = params;
    
    const queryParams = new URLSearchParams({
      pattern,
      pageNumber: pageNum.toString(),
      pageSize: pageSize.toString()
    });
    
    const response = await this.fetchWithTokenRefresh(`${config.API_URL}/search?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async searchTracks(params: SearchParams): Promise<SearchResponse> {
    const { pattern, pageNum = 1, pageSize = 10 } = params;
    
    const queryParams = new URLSearchParams({
      pattern,
      pageNumber: pageNum.toString(),
      pageSize: pageSize.toString()
    });
    
    const response = await this.fetchWithTokenRefresh(`${config.API_URL}/track/search?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async searchAlbums(params: SearchParams): Promise<SearchResponse> {
    const { pattern, pageNum = 1, pageSize = 10 } = params;
    
    const queryParams = new URLSearchParams({
      pattern,
      pageNumber: pageNum.toString(),
      pageSize: pageSize.toString()
    });
    
    const response = await this.fetchWithTokenRefresh(`${config.API_URL}/album/search?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async searchPlaylists(params: SearchParams): Promise<SearchResponse> {
    const { pattern, pageNum = 1, pageSize = 10 } = params;
    
    const queryParams = new URLSearchParams({
      pattern,
      pageNumber: pageNum.toString(),
      pageSize: pageSize.toString()
    });
    
    const response = await this.fetchWithTokenRefresh(`${config.API_URL}/playlist/search?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async searchUsers(params: SearchParams): Promise<SearchResponse> {
    const { pattern, pageNum = 1, pageSize = 10 } = params;
    
    const queryParams = new URLSearchParams({
      pattern,
      pageNumber: pageNum.toString(),
      pageSize: pageSize.toString()
    });
    
    const response = await this.fetchWithTokenRefresh(`${config.API_URL}/user/search?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  }
}

export default new SearchService(); 