import { injectable } from "inversify";
import { IPaymentRepository } from "../../application/interfaces/IRepositories/IPaymentRepository";
import { ExtendedPayment } from "../../application/types/ExtendedPayment";
import { BaseRepository } from "./Base/BaseRepository";

@injectable()
export class PaymentRepository extends BaseRepository<ExtendedPayment> implements IPaymentRepository {
  constructor() {
    super("Payment");
  };
}