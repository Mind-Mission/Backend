import { Article, Prisma } from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";

export interface IArticleRepository extends IBaseRepository<Article> {
  findFirst(args: Prisma.ArticleFindFirstArgs): Promise<Article | null>;
}