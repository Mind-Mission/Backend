import { container } from '../container/DIContainer';
import { IEnrollmentRepository } from '../../../application/interfaces/IRepositories/i-enrollment.repository';
import { EnrollmentRepository } from '../../../infrastructure/repositories/enrollment.repository';
import { IEnrollmentService } from '../../../application/interfaces/IServices/i-enrollment.service';
import { EnrollmentService } from '../../../application/services/enrollment.service';
import { EnrollmentController } from '../../controllers/EnrollmentController';

container.bind<IEnrollmentRepository>('IEnrollmentRepository').to(EnrollmentRepository).inSingletonScope();
container.bind<IEnrollmentService>('IEnrollmentService').to(EnrollmentService).inSingletonScope();
container.bind<EnrollmentController>('EnrollmentController').to(EnrollmentController).inSingletonScope();