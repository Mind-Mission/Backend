import { Payment } from "@prisma/client";
import { ExtendedPaymentUnit } from "./payment-unit.extend";

export interface ExtendedPayment extends Payment {
  paymentUnits?: ExtendedPaymentUnit[]
}