import { mockTracks } from "../mocks/trackMock";
import { Track } from "../types/track";
import { http } from "./http";
import authService from "./authService";

const API_URL = 'http://localhost:8085/api';

interface CreateTrackRequest {
  title: string;
  authorId?: string; // Если не указан, API должен использовать текущего пользователя
  albumId: string;
  duration: number;
  avatarUrl: string;
}

interface CreateTrackResponse {
  track: Track;
}

interface TracksResponse {
  tracks: Track[];
}

const trackService = {
  getTrackById: async (id: string): Promise<Track | null> => {
    try {
      return await http.get<Track>(`/tracks/${id}`);
    } catch {
      console.warn(`Ошибка загрузки трека с ID ${id}`);
      return null;
    }
  },

  getTrackByIdMock: async (id: string): Promise<Track | null> => {
    return mockTracks.find((track) => track.id === id) || null;
  },

  getTracksByUserId: async (id: string): Promise<Track[]> => {
    return mockTracks.filter((track) =>
      track.author.id == id
    );
  },

  searchTrackByNameMock: async (name: string): Promise<Track[]> => {
    if (!name.trim()) {
      return mockTracks;
    }

    const lowerCaseQuery = name.toLowerCase();

    const filteredAlbums = mockTracks.filter((t) =>
      t.title.toLowerCase().includes(lowerCaseQuery)
    );

    return filteredAlbums;
  },

  // Создание нового трека
  createTrack: async (trackData: CreateTrackRequest): Promise<Track> => {
    try {
      const accessToken = authService.getAccessToken();
      
      if (!accessToken) {
        throw new Error('Пользователь не авторизован');
      }

      // Если ID автора не передан, используем ID текущего пользователя
      if (!trackData.authorId) {
        const userId = authService.getUserId();
        if (userId) {
          trackData.authorId = userId;
        }
      }
      
      const response = await fetch(`${API_URL}/track`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trackData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании трека');
      }
      
      const data = await response.json() as CreateTrackResponse;
      return data.track;
    } catch (error) {
      console.error('Ошибка при создании трека:', error);
      throw error;
    }
  },

  async getAllTracks(): Promise<Track[]> {
    const response = await fetch(`${API_URL}/tracks`);
    if (!response.ok) {
      throw new Error('Failed to fetch all tracks');
    }
    const data: TracksResponse = await response.json();
    return data.tracks;
  },

  async uploadTrack(formData: FormData): Promise<Track> {
    const response = await fetch(`${API_URL}/track/upload`, {
      method: 'POST',
      body: formData,
      // Headers are not needed here as FormData sets Content-Type to multipart/form-data
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload track');
    }
    return response.json();
  },

  async getTracksByAuthor(authorId: string): Promise<Track[]> {
    const response = await fetch(`${API_URL}/track/author/${authorId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tracks by author');
    }
    const data: TracksResponse = await response.json();
    return data.tracks;
  },

  async getTrackStreamUrl(trackId: string): Promise<string> {
    const accessToken = authService.getAccessToken();
    const response = await fetch(`${API_URL}/track/${trackId}/stream`, {
      headers: accessToken ? {
        'Authorization': `Bearer ${accessToken}`
      } : {}
    });
    
    if (!response.ok) {
      throw new Error('Failed to get track stream URL');
    }
    
    return response.url;
  }
};

export default trackService;
