import { container } from '../container/DIContainer';
import { IStudentRepository } from '../../../application/interfaces/IRepositories/IStudentRepository';
import { StudentRepository } from '../../../infrastructure/repositories/StudentRepository';
import { IStudentService } from '../../../application/interfaces/IServices/IStudentService';
import { StudentService } from '../../../application/services/StudentService';
import { StudentController } from '../../controllers/StudentController';

container.bind<IStudentRepository>('IStudentRepository').to(StudentRepository).inSingletonScope();
container.bind<IStudentService>('IStudentService').to(StudentService).inSingletonScope();
container.bind<StudentController>('StudentController').to(StudentController).inSingletonScope();
