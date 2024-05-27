import { LessonType } from "@prisma/client";

export type CreateLesson = {
  title: string;
  isFree?: boolean;
  isDraft?: Boolean;
  attachment?: string; 
  order: number;
  sectionId: number;
};

export type UpdateLesson = {
  id: number;
  title?: string;
  isFree?: boolean;
  isDraft?: Boolean;
  isApproved?: boolean;
  attachment?: string; 
  lessonType?: LessonType;
  time?: number;
};