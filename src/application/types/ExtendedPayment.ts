import { Payment } from "@prisma/client";
import { ExtendedPaymentUnit } from "./ExtendedPaymentUnit";

export interface ExtendedPayment extends Payment {
  paymentUnits?: ExtendedPaymentUnit[]
}