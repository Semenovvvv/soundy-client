import { Album } from "../types/album";
import { Playlist } from "../types/playlist";
import { Timestamp } from "../types/timestamp";
import { Track } from "../types/track";
import { User } from "../types/user";

const track1: Track = {
  id: "track-001",
  title: "Лето начинается",
  author: {} as User,
  albumId: "",
  authorId: "",
  album: {} as Album,
  isLiked: false,
  duration: 210,
  createdAt: null,
  avatarUrl: null,
};

const track2: Track = {
  id: "track-002",
  title: "Танцевать всю ночь",
  author: {} as User,
  album: {} as Album,
  albumId: "",
  authorId: "",
  isLiked: false,
  duration: 195,
  createdAt: null,
  avatarUrl: null,
};

// === Альбомы ===
const album1: Album = {
  id: "album-001",
  title: "Хиты лета",
  authors: [],
  createdAt: "2023-06-01T00:00:00Z",
  avatarUrl: "https://picsum.photos/id/1018/300/300 ",
  tracks: [track1, track2],
  trackCount: 2,
};

const album2: Album = {
  id: "album-002",
  title: "Мой дебют",
  authors: [],
  createdAt: "2022-11-15T00:00:00Z",
  avatarUrl: "https://picsum.photos/id/1019/300/300 ",
  tracks: [track1],
  trackCount: 1,
};

const playlist1: Playlist = {
  id: "playlist-001",
  title: "Любимые треки",
  author: {} as User,
  authorId: "",
  createdAt: { nanos : 1, seconds: 2} as Timestamp,
  isFavorite: true,
  tracks: [track1, track2],
  trackCount: 2,
  avatarUrl: "https://picsum.photos/id/1027/300/300 ",
};

const playlist2: Playlist = {
  id: "playlist-002",
  title: "Фокус на работе",
  author: {} as User,
  authorId: "",
  createdAt: { nanos : 1, seconds: 2} as Timestamp,
  isFavorite: false,
  tracks: [track2],
  trackCount: 1,
  avatarUrl: "https://picsum.photos/id/1025/300/300 ",
};

export const mockUsers: User[] = [
  {
    id: "4b176629-7848-4883-992b-c4b087f03915",
    email: "alex@example.com",
    name: "Александр",
    createdAt: "2022-05-20T00:00:00Z",
    avatarUrl: "https://placehold.co/400",
    bio: "Создаю музыку и собираю крутые плейлисты.",
    playlists: [playlist1, playlist2],
    albums: [album1],
  },
  {
    id: "user-002",
    email: "maria@example.com",
    name: "Мария",
    createdAt: "2023-01-10T00:00:00Z",
    avatarUrl: "https://placehold.co/400",
    bio: "DJ. Люблю электронную музыку и вечеринки.",
    playlists: [playlist2],
    albums: [],
  },
  {
    id: "user-003",
    email: "djmax@example.com",
    name: "Maximus",
    createdAt: "2021-09-15T00:00:00Z",
    avatarUrl: "https://placehold.co/400",
    bio: "Продюсер и автор хитов.",
    playlists: [],
    albums: [album2],
  },
  {
    id: "user-004",
    email: "lena@example.com",
    name: "Елена",
    createdAt: "2024-02-01T00:00:00Z",
    avatarUrl: "https://placehold.co/400",
    bio: "Начинающий музыкант.",
    playlists: [],
    albums: [],
  },
];