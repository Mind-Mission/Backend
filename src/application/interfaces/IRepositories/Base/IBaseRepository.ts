import { ICreateBaseRepository } from "./ICreateBaseRepository";
import { IDeleteBaseRepository } from "./IDeleteBaseRepository";
import { IFindBaseRepository } from "./IFindBaseRepository";
import { IUpdateBaseRepository } from "./IUpdateBaseRepository";

export interface IBaseRepository<T> extends IFindBaseRepository<T>, ICreateBaseRepository<T>, IUpdateBaseRepository<T>, IDeleteBaseRepository<T> {
}