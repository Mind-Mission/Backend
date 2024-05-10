import { TransactionType } from "../../extended/transaction-type.extend";

export interface ICreateBaseRepository<T> {
  create(args: any, transaction?: TransactionType): Promise<T>;
}