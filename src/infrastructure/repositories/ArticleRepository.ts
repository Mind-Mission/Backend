import { Article } from "@prisma/client";
import { injectable } from "inversify";
import { BaseRepository } from "./Base/BaseRepository";
import { IArticleRepository } from "../../application/interfaces/IRepositories/IArticleRepository";

@injectable()
export class ArticleRepository extends BaseRepository<Article> implements IArticleRepository {
  constructor(){
    super("Article");
  }
}