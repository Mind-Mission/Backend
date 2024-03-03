import { Prisma, Article } from "@prisma/client";
import { CreateArticle, UpdateArticle } from "../../inputs/articleInput";
import { TransactionType } from "../../types/TransactionType";
import { ExtendedUser } from "../../types/ExtendedUser";
import { IResourceOwnership } from "./IResourceOwnership";

export interface IArticleService extends IResourceOwnership<Article> {
  count(args: Prisma.ArticleCountArgs): Promise<number>;
  findMany(args: Prisma.ArticleFindManyArgs): Promise<Article[]>;
  findUnique(args: Prisma.ArticleFindUniqueArgs): Promise<Article | null>
  create(args: {data: CreateArticle, select?: Prisma.ArticleSelect, include?: Prisma.ArticleInclude}, transaction?: TransactionType): Promise<Article>;
  update(args: {data: UpdateArticle, select?: Prisma.ArticleSelect, include?: Prisma.ArticleInclude}, transaction?: TransactionType): Promise<Article>;
  delete(args: {id: number, user: ExtendedUser}, transaction?: TransactionType): Promise<Article>;
}