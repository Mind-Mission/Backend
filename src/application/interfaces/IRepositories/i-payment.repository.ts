import { IBaseRepository } from "./Base/i-base.repository";
import { ExtendedPayment } from "../extended/payment.extend";

export interface IPaymentRepository extends IBaseRepository<ExtendedPayment> {
}