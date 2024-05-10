import { IBaseRepository } from "./Base/i-base.repository";
import { ExtendedPayment } from "../../types/ExtendedPayment";

export interface IPaymentRepository extends IBaseRepository<ExtendedPayment> {
}