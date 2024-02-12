import { Prisma, Cart } from "@prisma/client";
import { UpdateCart } from "../../inputs/cartInput";
import { TransactionType } from "../../types/TransactionType";

export interface ICartService {
  count(args: Prisma.CartCountArgs): Promise<number>;
  findMany(args: Prisma.CartFindManyArgs): Promise<Cart[]>;
  findUnique(args: Prisma.CartFindUniqueArgs): Promise<Cart | null>;
  findFirst(args: Prisma.CartFindFirstArgs): Promise<Cart | null>;
  update(args: {data: UpdateCart, select?: Prisma.CartSelect, include?: Prisma.CartInclude}, transaction?: TransactionType): Promise<Cart>;
}