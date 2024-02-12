export type CreateVideo = {
  title: string, 
  description?: string; 
  url: string;
  time: number;
  lessonId: number;
};

export type UpdateVideo = {
  id: number;
  title?: string, 
  description?: string; 
  url?: string;
  time?: number;
};