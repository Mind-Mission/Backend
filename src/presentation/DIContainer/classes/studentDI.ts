import { container } from '../container/DIContainer';
import { IStudentRepository } from '../../../application/interfaces/IRepositories/i-student.repository';
import { StudentRepository } from '../../../infrastructure/repositories/student.repository';
import { IStudentService } from '../../../application/interfaces/IServices/i-student.service';
import { StudentService } from '../../../application/services/student.service';
import { StudentController } from '../../controllers/StudentController';

container.bind<IStudentRepository>('IStudentRepository').to(StudentRepository).inSingletonScope();
container.bind<IStudentService>('IStudentService').to(StudentService).inSingletonScope();
container.bind<StudentController>('StudentController').to(StudentController).inSingletonScope();
