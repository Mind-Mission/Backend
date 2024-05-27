import { TransactionType } from "../../extended/transaction-type.extend";

export interface IUpdateBaseRepository<T> {
  update(args: any, transaction?: TransactionType): Promise<T>;
}