import { QuestionLevel } from "@prisma/client";
import { ExtendedUser } from "../types/ExtendedUser";

type Question = {
  id?: number;
  questionText: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  correctAnswer: string;
  order?: number;
  level: QuestionLevel;
}

export type CreateQuiz = {
  title: string; 
  description?: string; 
  time: number; 
  questions: Question[]; 
  lessonId: number;
  user: ExtendedUser;
}

export type UpdateQuiz = {
  id: number;
  title?: string; 
  description?: string; 
  time?: number; 
  questions?: Question[]; 
}