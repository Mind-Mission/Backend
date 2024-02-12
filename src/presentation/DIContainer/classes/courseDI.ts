import { container } from '../container/DIContainer';
import { ICourseRepository } from '../../../application/interfaces/IRepositories/ICourseRepository';
import { CourseRepository } from '../../../infrastructure/repositories/CourseRepository';
import { ICourseService } from '../../../application/interfaces/IServices/ICourseService';
import { CourseService } from '../../../application/services/CourseService';
import { CourseController } from '../../controllers/CourseController';

container.bind<ICourseRepository>('ICourseRepository').to(CourseRepository).inSingletonScope();
container.bind<ICourseService>('ICourseService').to(CourseService).inSingletonScope();
container.bind<CourseController>('CourseController').to(CourseController).inSingletonScope();
