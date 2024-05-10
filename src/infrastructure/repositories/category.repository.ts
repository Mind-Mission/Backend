import { Category } from "@prisma/client";
import { injectable } from "inversify";
import { ICategoryRepository } from "../../application/interfaces/IRepositories/ICategoryRepository";
import { BaseRepository } from "./Base/base.repository";

@injectable()
export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository {
  constructor() {
    super("Category");
  }
}