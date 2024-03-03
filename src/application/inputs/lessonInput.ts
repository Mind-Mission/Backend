import { LessonType } from "@prisma/client";
import { ExtendedUser } from "../types/ExtendedUser";

export type CreateLesson = {
  title: string;
  isFree?: boolean;
  isAvailable?: Boolean;
  attachment?: string; 
  order: number;
  sectionId: number;
  user: ExtendedUser;
};

export type UpdateLesson = {
  id: number;
  title?: string;
  isFree?: boolean;
  isAvailable?: Boolean;
  attachment?: string; 
  lessonType?: LessonType;
  time?: number;
  user?: ExtendedUser;
};