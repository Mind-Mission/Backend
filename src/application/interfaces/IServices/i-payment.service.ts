import { Prisma } from "@prisma/client";
import { CreatePayment, UpdatePayment } from "../../inputs/payment.input";
import { ExtendedPayment } from "../extended/payment.extend";
import { TransactionType } from "../extended/transaction-type.extend";

export interface IPaymentService {
  count(args: Prisma.PaymentCountArgs): Promise<number>;
  findMany(args: Prisma.PaymentFindManyArgs): Promise<ExtendedPayment[]>;
  findUnique(args: Prisma.PaymentFindUniqueArgs): Promise<ExtendedPayment | null>
  create(args: {data: CreatePayment, select?: Prisma.PaymentSelect, include?: Prisma.PaymentInclude}, transaction?: TransactionType): Promise<ExtendedPayment>;
  update(args: {data: UpdatePayment, select?: Prisma.PaymentSelect, include?: Prisma.PaymentInclude}, transaction?: TransactionType): Promise<ExtendedPayment>;
  delete(id: number, transaction?: TransactionType): Promise<ExtendedPayment>;
}