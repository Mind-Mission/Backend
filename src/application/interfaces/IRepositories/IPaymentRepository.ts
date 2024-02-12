import { IBaseRepository } from "./Base/IBaseRepository";
import { ExtendedPayment } from "../../types/ExtendedPayment";

export interface IPaymentRepository extends IBaseRepository<ExtendedPayment> {
}