import { Track } from "./track";
import { User } from "./user";

export type Playlist = {
    id: string;
    title: string;
    author: User | null;
    authorId: string;
    createdAt: Date;
    isFavorite: boolean;
    tracks: Track[];
    trackCount: number;
    avatarUrl: string | null;
  };
