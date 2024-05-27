import { Course, PaymentUnit } from "@prisma/client";

export interface ExtendedPaymentUnit extends PaymentUnit {
  course?: Course
}