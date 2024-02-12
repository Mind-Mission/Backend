export type CreateComment = {
  content: string;
  parentId?: number;
  lessonId: number;
  userId: number;
};

export type UpdateComment = {
  id: number;
  content?: string;
};