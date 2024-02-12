import { Coupon } from "@prisma/client";
import { injectable } from "inversify";
import { ICouponRepository } from "../../application/interfaces/IRepositories/ICouponRepository";
import { BaseRepository } from "./Base/BaseRepository";

@injectable()
export class CouponRepository extends BaseRepository<Coupon> implements ICouponRepository {
  constructor() {
    super("Coupon");
  }
}