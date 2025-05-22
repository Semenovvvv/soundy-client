import { Track } from "./track";
import { User } from "./user";

export type Album = {
  id: string;
  title: string;
  authors: User[];
  createdAt: string;
  avatarUrl: string | null;
  tracks?: Track[];
  trackCount?: number;
};