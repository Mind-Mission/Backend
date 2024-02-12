import { CourseLevel, Language } from "@prisma/client";

export type CreateCourse = {
  title: string;
  shortDescription: string;
  description: string;
  language: Language;
  level: CourseLevel;
  imageCover: string;
  requirements: string[];
  courseTeachings: string[];
  price: number;
  isDraft?: boolean;
  userId: number;
  topicId: number;
};

export type UpdateCourse = {
  id: number;
  title?: string;
  shortDescription?: string;
  description?: string;
  language?: Language;
  level?: CourseLevel;
  imageCover?: string;
  requirements?: string[];
  courseTeachings?: string[];
  price?: number;
  discountPercentage?: number;
  isApproved?: boolean;
  isDraft?: boolean;
  hours?: number;
  lectures?: number;
  articles?: number;
  quizzes?: number;
  sections?: {id: number, order: number}[];
  topicId?: number;
}