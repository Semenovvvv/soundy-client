import { Album } from "./album";
import { User } from "./user";

export type Track = {
    id: string;
    title: string;
    author: User;
    authorId: string;
    album: Album;
    albumId: string;
    isLiked: boolean;
    duration: number;
    createdAt: Date;
    avatarUrl: string | null;
  };