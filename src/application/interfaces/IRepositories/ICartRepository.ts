import { Prisma } from "@prisma/client";
import { IFindBaseRepository } from "./Base/IFindBaseRepository";
import { ExtendedCart } from "../../types/ExtenedCart";
import { TransactionType } from "../../types/TransactionType";

export interface ICartRepository extends IFindBaseRepository<ExtendedCart> {
  findFirst(args: Prisma.CartFindFirstArgs): Promise<ExtendedCart | null>;
  update(args: Prisma.CartUpdateArgs, transaction?: TransactionType): Promise<ExtendedCart>;
}