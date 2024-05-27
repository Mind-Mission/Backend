import { injectable } from "inversify";
import { IPaymentRepository } from "../../application/interfaces/IRepositories/i-payment.repository";
import { ExtendedPayment } from "../../application/interfaces/extended/payment.extend";
import { BaseRepository } from "./Base/base.repository";

@injectable()
export class PaymentRepository extends BaseRepository<ExtendedPayment> implements IPaymentRepository {
  constructor() {
    super("Payment");
  };
}