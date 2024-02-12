import { CategoryType } from "@prisma/client";

export type CreateCategory = {
  name: string;
  type: CategoryType;
  description?: string;
  parentId?: number;
}

export type UpdateCategory = {
  id: number;
  name?: string;
  type?: CategoryType;
  description?: string;
  parentId?: number;
}