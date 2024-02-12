import crypto from "crypto";
import { Prisma, Coupon } from "@prisma/client";
import {inject, injectable } from "inversify";
import { CreateCoupon, UpdateCoupon } from "../inputs/couponInput";
import { TransactionType } from "../types/TransactionType";
import {ICouponService} from "../interfaces/IServices/ICouponService";
import {ICouponRepository} from "../interfaces/IRepositories/ICouponRepository";

@injectable()
export class CouponService implements ICouponService {
	constructor(@inject('ICouponRepository') private couponRepository: ICouponRepository) {}
	
  private async generateRandomCode(): Promise<string> {
    const codeLength = 6;
    let code = undefined
    do {
      const randomCode = crypto.randomBytes(Math.ceil(codeLength)).toString('hex').slice(0, codeLength);
      const isCodeExist = await this.couponRepository.findUnique({
        where: {
          code: randomCode
        },
        select: {
          code: true
        }
      });
      if(!isCodeExist) {
        code = randomCode;
      }
    }while(!code);
    return code;
  };

	count(args: Prisma.CouponCountArgs): Promise<number> {
		return this.couponRepository.count(args);
	};

	findMany(args: Prisma.CouponFindManyArgs): Promise<Coupon[]> {
		return this.couponRepository.findMany(args);
	};

	findUnique(args: Prisma.CouponFindUniqueArgs): Promise<Coupon | null> {
		return this.couponRepository.findUnique(args);
	};

	async create(args: {data: CreateCoupon, select?: Prisma.CouponSelect, include?: Prisma.CouponInclude}, transaction?: TransactionType): Promise<Coupon> {
		const {discount, expiredAt, userId} = args.data;
    const code = await this.generateRandomCode();
    return this.couponRepository.create({
      data: {
        code,
        discount,
        expiredAt,
        admin: {
          connect: {
            userId
          }
        },
      },
      select: args.select,
      include: args.include
    }, transaction);
	};

	update(args: {data: UpdateCoupon, select?: Prisma.CouponSelect, include?: Prisma.CouponInclude}, transaction?: TransactionType): Promise<Coupon> {
		const {id, discount, expiredAt} = args.data;
    return this.couponRepository.update({
      where: {
        id
      },
      data: {
        discount: discount || undefined,
        expiredAt: expiredAt || undefined,
      },
      select: args.select,
      include: args.include
    }, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<Coupon> {
		return this.couponRepository.delete(id, transaction);
	};
}