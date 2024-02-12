import { container } from '../container/DIContainer';
import { IEnrollmentRepository } from '../../../application/interfaces/IRepositories/IEnrollmentRepository';
import { EnrollmentRepository } from '../../../infrastructure/repositories/EnrollmentRepository';
import { IEnrollmentService } from '../../../application/interfaces/IServices/IEnrollmentService';
import { EnrollmentService } from '../../../application/services/EnrollmentService';
import { EnrollmentController } from '../../controllers/EnrollmentController';

container.bind<IEnrollmentRepository>('IEnrollmentRepository').to(EnrollmentRepository).inSingletonScope();
container.bind<IEnrollmentService>('IEnrollmentService').to(EnrollmentService).inSingletonScope();
container.bind<EnrollmentController>('EnrollmentController').to(EnrollmentController).inSingletonScope();