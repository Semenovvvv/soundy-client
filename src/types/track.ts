import { Album } from "./album";
import { User } from "./user";

export type Track = {
    id: string;
    title: string;
    user: User;
    userId: string;
    album: Album;
    albumId: string;
    isLiked: boolean;
    duration: number;
    createdAt: Date;
    avatarUrl: string | null;
  };