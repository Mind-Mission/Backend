import { Prisma, Article } from "@prisma/client";
import { CreateArticle, UpdateArticle } from "../../inputs/articleInput";
import { TransactionType } from "../../types/TransactionType";

export interface IArticleService {
  count(args: Prisma.ArticleCountArgs): Promise<number>;
  findMany(args: Prisma.ArticleFindManyArgs): Promise<Article[]>;
  findUnique(args: Prisma.ArticleFindUniqueArgs): Promise<Article | null>
  create(args: {data: CreateArticle, select?: Prisma.ArticleSelect, include?: Prisma.ArticleInclude}, transaction?: TransactionType): Promise<Article>;
  update(args: {data: UpdateArticle, select?: Prisma.ArticleSelect, include?: Prisma.ArticleInclude}, transaction?: TransactionType): Promise<Article>;
  delete(id: number, transaction?: TransactionType): Promise<Article>;
}