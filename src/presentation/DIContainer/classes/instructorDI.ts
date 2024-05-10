import { container } from '../container/DIContainer';
import { IInstructorRepository } from '../../../application/interfaces/IRepositories/i-instructor.repository';
import { InstructorRepository } from '../../../infrastructure/repositories/instructor.repository';
import { IInstructorService } from '../../../application/interfaces/IServices/IInstructorService';
import { InstructorService } from '../../../application/services/InstructorService';
import { InstructorController } from '../../controllers/InstructorController';

container.bind<IInstructorRepository>('IInstructorRepository').to(InstructorRepository).inSingletonScope();
container.bind<IInstructorService>('IInstructorService').to(InstructorService).inSingletonScope();
container.bind<InstructorController>('InstructorController').to(InstructorController).inSingletonScope();
