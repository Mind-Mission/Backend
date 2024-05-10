import { TransactionType } from "../../extended/transaction-type.extend";

export interface IDeleteBaseRepository<T> {
  delete(id: number, transaction?: TransactionType): Promise<T>;
}