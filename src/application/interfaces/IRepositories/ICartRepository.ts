import { Prisma, Cart } from "@prisma/client";
import { IFindBaseRepository } from "./Base/IFindBaseRepository";
import { TransactionType } from "../../types/TransactionType";

export interface ICartRepository extends IFindBaseRepository<Cart> {
  findFirst(args: Prisma.CartFindFirstArgs): Promise<Cart | null>;
  update(args: Prisma.CartUpdateArgs, transaction?: TransactionType): Promise<Cart>;
}