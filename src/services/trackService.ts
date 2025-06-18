import { Track } from "../types/track";
import { http } from "./http";
import authService from "./authService";

interface CreateTrackRequest {
  title: string;
  authorId?: string;
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

interface LikeTrackResponse {
  success: boolean;
  track: Track;
}

const trackService = {
  getTrackById: async (id: string): Promise<Track | null> => {
    try {
      return await http.get<Track>(`/tracks/${id}`);
    } catch {
      console.warn(`Error loading track with ID ${id}`);
      return null;
    }
  },

  // Create new track
  createTrack: async (trackData: CreateTrackRequest): Promise<Track> => {
    try {
      // If authorId is not provided, use current user's ID
      if (!trackData.authorId) {
        const userId = authService.getUserId();
        if (userId) {
          trackData.authorId = userId;
        }
      }
      
      const response = await http.post<CreateTrackResponse>('/track', trackData);
      return response.track;
    } catch (error) {
      console.error('Error creating track:', error);
      throw error;
    }
  },

  async getAllTracks(): Promise<Track[]> {
    try {
      const data = await http.get<TracksResponse>('/tracks');
      return data.tracks;
    } catch (error) {
      console.error('Error fetching all tracks:', error);
      throw new Error('Failed to fetch all tracks');
    }
  },

  async uploadTrack(formData: FormData): Promise<Track> {
    try {
      return await http.upload<Track>('/track/upload', formData, false);
    } catch (error) {
      console.error('Error uploading track:', error);
      throw new Error('Failed to upload track');
    }
  },

  async getTracksByAuthor(authorId: string): Promise<Track[]> {
    try {
      const data = await http.get<TracksResponse>(`/track/author/${authorId}`);
      return data.tracks;
    } catch (error) {
      console.error(`Error fetching tracks by author ${authorId}:`, error);
      throw new Error('Failed to fetch tracks by author');
    }
  },

  async getTrackStreamUrl(trackId: string): Promise<string> {
    try {
      // We need to construct the full URL here since we need to return the URL directly
      const accessToken = authService.getAccessToken();
      const baseUrl = `${window.location.protocol}//${window.location.host}/api/track/${trackId}/stream`;
      
      // Add token to URL if available
      if (accessToken) {
        return `${baseUrl}?token=${encodeURIComponent(accessToken)}`;
      }
      
      return baseUrl;
    } catch (error) {
      console.error(`Error getting stream URL for track ${trackId}:`, error);
      throw new Error('Failed to get track stream URL');
    }
  },

  async deleteTrack(trackId: string): Promise<void> {
    try {
      await http.delete(`/track/${trackId}`);
    } catch (error) {
      console.error(`Error deleting track ${trackId}:`, error);
      throw new Error('Failed to delete track');
    }
  },

  async likeTrack(trackId: string): Promise<Track> {
    try {
      const userId = authService.getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await http.post<LikeTrackResponse>('/track/like', {
        trackId,
        userId
      });

      return response.track;
    } catch (error) {
      console.error(`Error liking track ${trackId}:`, error);
      throw new Error('Failed to like track');
    }
  }
};

export default trackService;
