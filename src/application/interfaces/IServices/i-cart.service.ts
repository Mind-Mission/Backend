import { Prisma } from "@prisma/client";
import { ExtendedCart } from "../extended/cart.extend";
import { UpdateCart } from "../../inputs/cart.input";
import { TransactionType } from "../extended/transaction-type.extend";

export interface ICartService {
  count(args: Prisma.CartCountArgs): Promise<number>;
  findMany(args: Prisma.CartFindManyArgs): Promise<ExtendedCart[]>;
  findUnique(args: Prisma.CartFindUniqueArgs): Promise<ExtendedCart | null>;
  findFirst(args: Prisma.CartFindFirstArgs): Promise<ExtendedCart | null>;
  update(args: {data: UpdateCart, select?: Prisma.CartSelect, include?: Prisma.CartInclude}, transaction?: TransactionType): Promise<ExtendedCart>;
}