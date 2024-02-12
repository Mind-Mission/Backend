export type CreateMessage = {
  name: string;
  email: string;
  message: string;
};

export type UpdateMessage = {
  id: number
  subject: string;
  reply: string;
  replierId: number;
};