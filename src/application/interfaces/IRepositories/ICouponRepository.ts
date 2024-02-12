import { Coupon } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface ICouponRepository extends IBaseRepository<Coupon> {
}