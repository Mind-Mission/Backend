import { Category } from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";

export interface ICategoryRepository extends IBaseRepository<Category> {
}