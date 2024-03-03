import { ExtendedUser } from "../types/ExtendedUser";

export type CreateArticle = {
  title: string;
  content: string;
  time: number;
  lessonId: number;
  user: ExtendedUser;
}

export type UpdateArticle = {
  id: number;
  title?: string;
  content?: string;
  time?: number;
}