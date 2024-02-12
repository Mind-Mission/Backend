import { container } from '../container/DIContainer';
import { IPaymentRepository } from '../../../application/interfaces/IRepositories/IPaymentRepository';
import { PaymentRepository } from '../../../infrastructure/repositories/PaymentRepository';
import { IPaymentService } from '../../../application/interfaces/IServices/IPaymentService';
import { PaymentService } from '../../../application/services/PaymentService';
import { PaymentController } from '../../controllers/PaymentController';

container.bind<IPaymentRepository>('IPaymentRepository').to(PaymentRepository).inSingletonScope();
container.bind<IPaymentService>('IPaymentService').to(PaymentService).inSingletonScope();
container.bind<PaymentController>('PaymentController').to(PaymentController).inSingletonScope();