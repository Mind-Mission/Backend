export type CreateCoupon = {
  discount: number;
  expiredAt: Date;
  userId: number
}

export type UpdateCoupon = {
  id: number;
  discount?: number;
  expiredAt?: Date;
}