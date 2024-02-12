import { Prisma, Category } from "@prisma/client";
import { CreateCategory, UpdateCategory } from "../../inputs/categoryInput";
import { TransactionType } from "../../types/TransactionType";

export interface ICategoryService {
  count(args: Prisma.CategoryCountArgs): Promise<number>;
  findMany(args: Prisma.CategoryFindManyArgs): Promise<Category[]>;
  findUnique(args: Prisma.CategoryFindUniqueArgs): Promise<Category | null>
  create(args: {data: CreateCategory, select?: Prisma.CategorySelect, include?: Prisma.CategoryInclude}, transaction?: TransactionType): Promise<Category>;
  update(args: {data: UpdateCategory, select?: Prisma.CategorySelect, include?: Prisma.CategoryInclude}, transaction?: TransactionType): Promise<Category>;
  delete(id: number, transaction?: TransactionType): Promise<Category>;
};