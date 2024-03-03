import { Prisma } from "@prisma/client";
import { ExtendedCart } from "../../types/ExtenedCart";
import { UpdateCart } from "../../inputs/cartInput";
import { TransactionType } from "../../types/TransactionType";

export interface ICartService {
  count(args: Prisma.CartCountArgs): Promise<number>;
  findMany(args: Prisma.CartFindManyArgs): Promise<ExtendedCart[]>;
  findUnique(args: Prisma.CartFindUniqueArgs): Promise<ExtendedCart | null>;
  findFirst(args: Prisma.CartFindFirstArgs): Promise<ExtendedCart | null>;
  update(args: {data: UpdateCart, select?: Prisma.CartSelect, include?: Prisma.CartInclude}, transaction?: TransactionType): Promise<ExtendedCart>;
}