import { Currency, PaymentMethod, PaymentStatus } from "@prisma/client";

export type CreatePayment = {
  currency: Currency;
  paymentMethod: PaymentMethod;
  studentId: number;
  couponCode?: string;
}

export type UpdatePayment = {
  id: number;
  status?: PaymentStatus;
}