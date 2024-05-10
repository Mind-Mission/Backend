import { Prisma, Cart } from "@prisma/client"
import {inject, injectable } from "inversify"
import { UpdateCart} from "../inputs/cartInput";
import { ICartRepository } from "../interfaces/IRepositories/i-cart.repository"
import { ICartService } from "../interfaces/IServices/ICartService"
import { ICourseService } from "../interfaces/IServices/ICourseService";
import { TransactionType } from "../types/TransactionType";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class CartService implements ICartService {
	constructor(@inject('ICartRepository') private cartRepository: ICartRepository, @inject('ICourseService') private courseService: ICourseService) {}

  private async isCurrentUserInstructorForThisCourse(userId: number, courseId: number): Promise<boolean> {
    const isCourseExist = await this.courseService.findFirst({
      where: {
        id: courseId,
        instructor: {
          userId
        }
      },
      select: {
        id: true
      }
    });
    return isCourseExist ? true : false;
  };

  private async getCartId(userId: number): Promise<number> {
    const cart = await this.cartRepository.findFirst({
      where: {
        student: {
          userId
        }
      },
      select: {
        id: true
      }
    });
    return cart?.id as number;
  };

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
  };

	async update(args: {data: UpdateCart, select?: Prisma.CartSelect, include?: Prisma.CartInclude}, transaction?: TransactionType): Promise<Cart> {
		const {userId, courseId, operation} = args.data;
    if(operation === 'Add' && await this.isCurrentUserInstructorForThisCourse(userId, courseId)) {
      throw new APIError('You cannot add your course into your cart', HttpStatusCode.Forbidden);
    }
    const cartId = await this.getCartId(userId);
		return this.cartRepository.update({
      where: {
        id: cartId,
      },
      data: {
        courses: {
          connect: operation === 'Add' ? { 
            id: courseId
          } : undefined,
          disconnect: operation === 'Remove' ? {
            id: courseId
          } : undefined,
        }
      },
      select: args.select,
      include: args.include
    }, transaction);
	};
}