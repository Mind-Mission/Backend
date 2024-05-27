import { Prisma, Coupon } from "@prisma/client";
import { CreateCoupon, UpdateCoupon } from "../../inputs/coupon.input";
import { TransactionType } from "../extended/transaction-type.extend";

export interface ICouponService {
  count(args: Prisma.CouponCountArgs): Promise<number>;
  findMany(args: Prisma.CouponFindManyArgs): Promise<Coupon[]>;
  findUnique(args: Prisma.CouponFindUniqueArgs): Promise<Coupon | null>
  create(args: {data: CreateCoupon, select?: Prisma.CouponSelect, include?: Prisma.CouponInclude}, transaction?: TransactionType): Promise<Coupon>;
  update(args: {data: UpdateCoupon, select?: Prisma.CouponSelect, include?: Prisma.CouponInclude}, transaction?: TransactionType): Promise<Coupon>;
  delete(id: number, transaction?: TransactionType): Promise<Coupon>;
}