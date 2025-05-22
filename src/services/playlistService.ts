import { Playlist } from "../types/playlist";
import { Timestamp } from "../types/timestamp";
import { Track } from "../types/track";

const playlistService = {
  
  getFavorite: async (authorId: string): Promise<Playlist> => {
    try {
    const response = await fetch(`/api/playlist/favorite/${authorId}`);
    const data = await response.json();
    const rawPlaylist = data.playlist;

    const parseTimestampToDate = (timestamp: Timestamp): Date =>
      new Date(timestamp.seconds * 1000 + timestamp.nanos / 1_000_000);

    const tracks: Track[] = rawPlaylist.tracks.map((track: Track) => ({
      id: track.id,
      title: track.title,
      authorId: track.authorId,
      albumId: track.albumId,
      createdAt: track.createdAt,
      duration: track.duration,
      avatarUrl: track.avatarUrl,
    }));

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

getPlaylistsByUserId : async (authorId: string): Promise<Playlist[]> => {
  try {
    const response = await fetch(`/api/playlist/author/${authorId}`);
    const data = await response.json();
    const rawPlaylists = data.playlists;

    const playlists: Playlist[] = rawPlaylists.map((playlist: Playlist) => ({
      id: playlist.id,
      title: playlist.title,
      authorId: playlist.authorId,
      createdAt: playlist.createdAt,
      avatarUrl: playlist.avatarUrl,
      trackCount : playlist.trackCount
    }));

    return playlists;
  } catch (error) {
    console.error('Не удалось загрузить избранный плейлист', error);
    throw error;
  }
},

getPlaylistById: async (id : string) : Promise<Playlist> => {
  try {
    const response = await fetch(`/api/playlist//${id}`);
    const data = await response.json();
    const rawPlaylist = data.playlist;

    const parseTimestampToDate = (timestamp: Timestamp): Date =>
      new Date(timestamp.seconds * 1000 + timestamp.nanos / 1_000_000);

    const tracks: Track[] = rawPlaylist.tracks.map((track: Track) => ({
      id: track.id,
      title: track.title,
      authorId: track.authorId,
      albumId: track.albumId,
      createdAt: track.createdAt,
      duration: track.duration,
      avatarUrl: track.avatarUrl,
    }));


    const playlist: Playlist = {
      id: rawPlaylist.id,
      title: rawPlaylist.title,
      authorId: rawPlaylist.authorId,
      createdAt: parseTimestampToDate(rawPlaylist.createdAt),
      avatarUrl: rawPlaylist.avatarUrl,
      trackCount : rawPlaylist.trackCount,
      author: null,
      isFavorite: false,
      tracks: tracks
    };

    return playlist;
  } catch (error) {
    console.error('Не удалось загрузить избранный плейлист', error);
    throw error;
  }
}
};

export default playlistService;
