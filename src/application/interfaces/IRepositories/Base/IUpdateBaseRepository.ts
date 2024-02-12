import { TransactionType } from "../../../types/TransactionType";

export interface IUpdateBaseRepository<T> {
  update(args: any, transaction?: TransactionType): Promise<T>;
}