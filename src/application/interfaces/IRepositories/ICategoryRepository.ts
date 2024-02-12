import { Category } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface ICategoryRepository extends IBaseRepository<Category> {
}