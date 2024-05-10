import { Article, Prisma } from "@prisma/client";
import { injectable } from "inversify";
import { BaseRepository } from "./Base/base.repository";
import { IArticleRepository } from "../../application/interfaces/IRepositories/IArticleRepository";
import prisma from "../../domain/db";

@injectable()
export class ArticleRepository extends BaseRepository<Article> implements IArticleRepository {
  constructor(){
    super("Article");
  }

  findFirst(args: Prisma.ArticleFindFirstArgs): Promise<Article | null> {
    return prisma.article.findFirst(args);
  };
}