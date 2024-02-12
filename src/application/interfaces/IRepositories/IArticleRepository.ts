import { Article } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface IArticleRepository extends IBaseRepository<Article> {
}