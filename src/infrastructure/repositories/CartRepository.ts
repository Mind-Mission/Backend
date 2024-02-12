import { Cart, Prisma } from "@prisma/client";
import { injectable } from "inversify";
import { ICartRepository } from "../../application/interfaces/IRepositories/ICartRepository";
import { TransactionType } from "../../application/types/TransactionType";
import prisma from "../../domain/db";

@injectable()
export class CartRepository implements ICartRepository {

  count(args: Prisma.CartCountArgs): Promise<number> {
    throw prisma.cart.count(args);
  };

  findMany(args: Prisma.CartFindManyArgs): Promise<Cart[]> {
    return prisma.cart.findMany(args);
  };

  findUnique(args: Prisma.CartFindUniqueArgs): Promise<Cart | null> {
    return prisma.cart.findUnique(args);
  };

  findFirst(args: Prisma.CartFindFirstArgs): Promise<Cart | null> {
    return prisma.cart.findFirst(args);
  }

  update(args: Prisma.CartUpdateArgs, transaction?: TransactionType): Promise<Cart> {
    return (transaction || prisma).cart.update(args);
  };
}