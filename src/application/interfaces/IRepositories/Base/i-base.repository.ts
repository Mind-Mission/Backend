import { ICreateBaseRepository } from "./i-create-base.repository";
import { IDeleteBaseRepository } from "./i-delete-base.repository";
import { IFindBaseRepository } from "./i-find-base.repository";
import { IUpdateBaseRepository } from "./i-update-base.repository";

export interface IBaseRepository<T> extends IFindBaseRepository<T>, ICreateBaseRepository<T>, IUpdateBaseRepository<T>, IDeleteBaseRepository<T> {
}