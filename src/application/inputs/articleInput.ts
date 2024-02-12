export type CreateArticle = {
  title: string;
  content: string;
  time: number;
  lessonId: number;
}

export type UpdateArticle = {
  id: number;
  title?: string;
  content?: string;
  time?: number;
}