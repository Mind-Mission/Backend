import crypto from "crypto";
import { Prisma, Coupon, Course } from "@prisma/client";
import {inject, injectable } from "inversify";
import {ICouponService} from "../interfaces/IServices/ICouponService";
import {ICouponRepository} from "../interfaces/IRepositories/i-coupon.repository";
import { CreateCoupon, UpdateCoupon } from "../inputs/couponInput";
import { TransactionType } from "../types/TransactionType";
import { IResourceOwnership } from "../interfaces/IServices/IResourceOwnership";
import { ExtendedUser } from "../types/ExtendedUser";

@injectable()
export class CouponService implements ICouponService, IResourceOwnership<Coupon> {
	constructor(@inject('ICouponRepository') private couponRepository: ICouponRepository) {}

  async isResourceBelongsToCurrentUser(user: ExtendedUser, ...couponIds: number[]): Promise<boolean> {
    if(user.roles.includes('Admin')) {
      return true;
    }
    const courses = await this.findMany({
      where: {
        id: {
          in: couponIds
        },
        userId: user.id
      },
      select: {
        id: true
      }
    });
    return courses.length === couponIds.length ? true : false;
  };

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
		const {courses, discount, expiredAt, userId} = args.data;
    const code = await this.generateRandomCode();
    return this.couponRepository.create({
      data: {
        code,
        discount,
        expiredAt,
        courses: {
          connect: courses.map(course => {
            return {
              id: course
            }
          })
        },
        user: {
          connect: {
            id: userId
          }
        }
      },
      select: args.select,
      include: args.include
    }, transaction);
	};  

	async update(args: {data: UpdateCoupon, select?: Prisma.CouponSelect, include?: Prisma.CouponInclude}, transaction?: TransactionType): Promise<Coupon> {
		const {id, courses, discount, expiredAt} = args.data;
    let disConnectedCourses: number[] = []
    if(courses && courses.length > 0) {
      const coupon = await this.findUnique({
        where: {
          id
        },
        select: {
          courses: {
            select: {
              id: true
            }
          }
        }
      }) as any;
      disConnectedCourses = coupon ? (coupon.courses as Course[]).map(({id}) => id).filter((id) => !courses.includes(id)) : disConnectedCourses as any;
    }
    return this.couponRepository.update({
      where: {
        id
      },
      data: {
        discount: discount || undefined,
        expiredAt: expiredAt || undefined,
        courses: courses ? {
          disconnect: disConnectedCourses.length > 0 ? disConnectedCourses.map((course) => {
            return {
              id: course
            }
          }) : undefined,
          connect: courses.map(course => {
            return {
              id: course
            }
          })
        } : undefined
      },
      select: args.select,
      include: args.include
    }, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<Coupon> {
		return this.couponRepository.delete(id, transaction);
	};
}