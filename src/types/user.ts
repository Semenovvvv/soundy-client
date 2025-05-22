import { Album } from "./album";
import { Playlist } from "./playlist";

export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  avatarUrl?: string | null;
  bio?: string | null;
  role?: string;
  playlists?: Playlist[];
  albums?: Album[];
  isCurrentUser?: boolean;
};