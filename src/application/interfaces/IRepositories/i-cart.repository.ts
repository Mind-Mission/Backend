import { Prisma } from "@prisma/client";
import { IFindBaseRepository } from "./Base/i-find-base.repository";
import { ExtendedCart } from "../extended/cart.extend";
import { TransactionType } from "../extended/transaction-type.extend";

export interface ICartRepository extends IFindBaseRepository<ExtendedCart> {
  findFirst(args: Prisma.CartFindFirstArgs): Promise<ExtendedCart | null>;
  update(args: Prisma.CartUpdateArgs, transaction?: TransactionType): Promise<ExtendedCart>;
}