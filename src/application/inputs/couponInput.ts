export type CreateCoupon = {
  discount: number;
  courses: number[];
  expiredAt: Date;
  userId: number;
}

export type UpdateCoupon = {
  id: number;
  courses?: number[];
  discount?: number;
  expiredAt?: Date;
}