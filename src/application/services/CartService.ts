import { Prisma, Cart, Course } from "@prisma/client"
import {inject, injectable } from "inversify"
import { UpdateCart} from "../inputs/cartInput";
import { ICartRepository } from "../interfaces/IRepositories/ICartRepository"
import { ICartService } from "../interfaces/IServices/ICartService"
import { TransactionType } from "../types/TransactionType";

@injectable()
export class CartService implements ICartService {
	constructor(@inject('ICartRepository') private cartRepository: ICartRepository) {}

	count(args: Prisma.CartCountArgs): Promise<number> {
		return this.cartRepository.count(args);
	};

	findMany(args: Prisma.CartFindManyArgs): Promise<Cart[]> {
		return this.cartRepository.findMany(args);
	};

	findUnique(args: Prisma.CartFindUniqueArgs): Promise<Cart | null> {
		return this.cartRepository.findUnique(args);
	};

  findFirst(args: Prisma.CartFindFirstArgs): Promise< Cart | null> {
    return this.cartRepository.findFirst(args);
  }

	async update(args: {data: UpdateCart, select?: Prisma.CartSelect, include?: Prisma.CartInclude}, transaction?: TransactionType): Promise<Cart> {
		const {userId, courseIds} = args.data;
    const cart = await this.cartRepository.findFirst({
      where: {
        student: {
          userId
        }
      },
      select: {
        studentId: true,
        courses: {
          select: {
            id: true
          }
        }
      }
    }) as any;
		return this.cartRepository.update({
      where: {
        studentId: cart.studentId
      },
      data: {
        courses: {
          disconnect: cart?.courses.length ? cart.courses.map(({id}: Course) => ({id})) : undefined,
          connect: courseIds.map(id => ({id}))
        }
      },
      select: args.select,
      include: args.include
    }, transaction);
	};
}