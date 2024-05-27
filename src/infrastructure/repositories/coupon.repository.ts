import { Coupon } from "@prisma/client";
import { injectable } from "inversify";
import { ICouponRepository } from "../../application/interfaces/IRepositories/i-coupon.repository";
import { BaseRepository } from "./Base/base.repository";

@injectable()
export class CouponRepository extends BaseRepository<Coupon> implements ICouponRepository {
  constructor() {
    super("Coupon");
  }
}