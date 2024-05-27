import { container } from '../container/DIContainer';
import { IPaymentRepository } from '../../../application/interfaces/IRepositories/i-payment.repository';
import { PaymentRepository } from '../../../infrastructure/repositories/payment.repository';
import { IPaymentService } from '../../../application/interfaces/IServices/i-payment.service';
import { PaymentService } from '../../../application/services/payment.service';
import { PaymentController } from '../../controllers/PaymentController';

container.bind<IPaymentRepository>('IPaymentRepository').to(PaymentRepository).inSingletonScope();
container.bind<IPaymentService>('IPaymentService').to(PaymentService).inSingletonScope();
container.bind<PaymentController>('PaymentController').to(PaymentController).inSingletonScope();