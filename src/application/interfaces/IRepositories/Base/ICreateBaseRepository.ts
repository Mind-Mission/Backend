import { TransactionType } from "../../../types/TransactionType";

export interface ICreateBaseRepository<T> {
  create(args: any, transaction?: TransactionType): Promise<T>;
}