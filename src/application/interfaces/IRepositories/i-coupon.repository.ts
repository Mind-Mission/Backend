import { Coupon } from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";

export interface ICouponRepository extends IBaseRepository<Coupon> {
}