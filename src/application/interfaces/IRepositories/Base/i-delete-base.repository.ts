import { TransactionType } from "../../../types/TransactionType";

export interface IDeleteBaseRepository<T> {
  delete(id: number, transaction?: TransactionType): Promise<T>;
}