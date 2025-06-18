import { Track } from "./track";
import { User } from "./user";

export type Album = {
  id: string;
  title: string;
  authorId?: string;
  ownerId?: string;
  authors?: User[];
  createdAt: string | { seconds: number; nanos: number };
  avatarUrl: string | null;
  tracks?: Track[];
  trackCount?: number;
};