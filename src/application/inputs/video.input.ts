import { ExtendedUser } from "../interfaces/extended/user.extend";

export type CreateVideo = {
  title: string, 
  description?: string; 
  url: string;
  time: number;
  lessonId: number;
  user: ExtendedUser;
};

export type UpdateVideo = {
  id: number;
  title?: string, 
  description?: string; 
  url?: string;
  time?: number;
  user: ExtendedUser;
};