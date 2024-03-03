import { ExtendedUser } from "../types/ExtendedUser";

export type CreateSection = {
  title: string;
  description?: string;
  isAvailable?: Boolean;
  order: number;
  courseId: number;
  user: ExtendedUser;
}

export type UpdateSection = {
  id: number;
  title?: string;
  description?: string;
  isAvailable?: Boolean;
  lessons?: {id: number, order: number}[];
  user: ExtendedUser;
}