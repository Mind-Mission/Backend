import { ExtendedUser } from "../interfaces/extended/user.extend";

export type CreateSection = {
  title: string;
  description?: string;
  isDraft?: Boolean;
  order: number;
  courseId: number;
}

export type UpdateSection = {
  id: number;
  title?: string;
  description?: string;
  isDraft?: Boolean;
  lessons?: {id: number, order: number}[];
}