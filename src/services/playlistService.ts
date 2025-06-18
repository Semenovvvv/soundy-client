import { Playlist } from "../types/playlist";
import { Timestamp } from "../types/timestamp";
import { Track } from "../types/track";
import { User } from "../types/user";
import { http } from "./http";

interface RawPlaylist {
  id: string;
  title: string;
  authorId: string;
  createdAt: Timestamp;
  avatarUrl: string;
  trackCount: number;
  tracks?: RawTrack[];
}

interface RawTrack {
  id: string;
  title: string;
  user: { id: string; username?: string };
  userId: string;
  album: { id: string; title: string };
  albumId: string;
  createdAt: Date;
  duration: number;
  avatarUrl: string;
  isLiked?: boolean;
}

interface PlaylistResponse {
  playlist: RawPlaylist;
}

interface PlaylistsResponse {
  playlists: RawPlaylist[];
}

const playlistService = {
  
  getFavorite: async (authorId: string): Promise<Playlist> => {
    try {
      const data = await http.get<PlaylistResponse>(`/playlist/favorite/${authorId}`);
      const rawPlaylist = data.playlist;

      const parseTimestampToDate = (timestamp: Timestamp): Date =>
        new Date(timestamp.seconds * 1000 + timestamp.nanos / 1_000_000);

      // При конвертации данных, создаем объекты согласно требуемым типам
      const tracks: Track[] = (rawPlaylist.tracks || []).map((track: RawTrack) => {
        // Создаем объект User в соответствии с типом
        const user: User = {
          id: track.userId || track.user?.id || '',
          name: track.user?.username || '',
          email: '',
          createdAt: new Date().toISOString()
        };
        
        // Создаем минимальный объект Album с правильным типом createdAt
        const album = {
          id: track.albumId,
          title: track.album?.title || '',
          authorId: '',
          createdAt: new Date().toISOString(), // Используем строку вместо Date
          avatarUrl: null,
          trackCount: 0
        };

        return {
          id: track.id,
          title: track.title,
          user: user,
          userId: track.userId,
          album: album,
          albumId: track.albumId,
          isLiked: track.isLiked || false,
          createdAt: track.createdAt,
          duration: track.duration,
          avatarUrl: track.avatarUrl
        };
      });

      return {
        id: rawPlaylist.id,
        title: rawPlaylist.title,
        authorId: rawPlaylist.authorId,
        createdAt: parseTimestampToDate(rawPlaylist.createdAt),
        avatarUrl: rawPlaylist.avatarUrl,
        tracks,
        trackCount: rawPlaylist.trackCount,
        author: null,
        isFavorite: true,
      };
    } catch (error) {
      console.error('Не удалось загрузить избранный плейлист', error);
      throw error;
    }
  },

  getPlaylistsByUserId: async (authorId: string): Promise<Playlist[]> => {
    try {
      const data = await http.get<PlaylistsResponse>(`/playlist/author/${authorId}`);
      const rawPlaylists = data.playlists;

      const playlists: Playlist[] = rawPlaylists.map((playlist: RawPlaylist) => ({
        id: playlist.id,
        title: playlist.title,
        authorId: playlist.authorId,
        createdAt: new Date(), // Временно используем текущую дату, если createdAt - это Timestamp
        avatarUrl: playlist.avatarUrl,
        trackCount: playlist.trackCount,
        author: null,
        isFavorite: false,
        tracks: []
      }));

      return playlists;
    } catch (error) {
      console.error('Не удалось загрузить плейлисты пользователя', error);
      throw error;
    }
  },

  getPlaylistById: async (id: string): Promise<Playlist> => {
    try {
      const data = await http.get<PlaylistResponse>(`/playlist/${id}`);
      const rawPlaylist = data.playlist;

      const parseTimestampToDate = (timestamp: Timestamp): Date =>
        new Date(timestamp.seconds * 1000 + timestamp.nanos / 1_000_000);

      // При конвертации данных, создаем объекты согласно требуемым типам
      const tracks: Track[] = (rawPlaylist.tracks || []).map((track: RawTrack) => {
        // Создаем объект User в соответствии с типом
        const user: User = {
          id: track.userId || track.user?.id || '',
          name: track.user?.username || '',
          email: '',
          createdAt: new Date().toISOString()
        };
        
        // Создаем минимальный объект Album с правильным типом createdAt
        const album = {
          id: track.albumId,
          title: track.album?.title || '',
          authorId: '',
          createdAt: new Date().toISOString(), // Используем строку вместо Date
          avatarUrl: null,
          trackCount: 0
        };

        return {
          id: track.id,
          title: track.title,
          user: user,
          userId: track.userId,
          album: album,
          albumId: track.albumId,
          isLiked: track.isLiked || false,
          createdAt: track.createdAt,
          duration: track.duration,
          avatarUrl: track.avatarUrl
        };
      });

      const playlist: Playlist = {
        id: rawPlaylist.id,
        title: rawPlaylist.title,
        authorId: rawPlaylist.authorId,
        createdAt: parseTimestampToDate(rawPlaylist.createdAt),
        avatarUrl: rawPlaylist.avatarUrl,
        trackCount: rawPlaylist.trackCount,
        author: null,
        isFavorite: false,
        tracks: tracks
      };

      return playlist;
    } catch (error) {
      console.error('Не удалось загрузить плейлист', error);
      throw error;
    }
  }
};

export default playlistService;
