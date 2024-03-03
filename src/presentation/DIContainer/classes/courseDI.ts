import { Course } from '@prisma/client';
import { container } from '../container/DIContainer';
import { ICourseRepository } from '../../../application/interfaces/IRepositories/ICourseRepository';
import { CourseRepository } from '../../../infrastructure/repositories/CourseRepository';
import { ICourseService } from '../../../application/interfaces/IServices/ICourseService';
import { CourseService } from '../../../application/services/CourseService';
import { IResourceOwnership } from '../../../application/interfaces/IServices/IResourceOwnership';
import { CourseController } from '../../controllers/CourseController';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';

container.bind<ICourseRepository>('ICourseRepository').to(CourseRepository).inSingletonScope();
container.bind<ICourseService>('ICourseService').to(CourseService).inSingletonScope();
container.bind<IResourceOwnership<Course>>('IResourceOwnership<Course>').to(CourseService).inSingletonScope();
container.bind<ResourceOwnership<Course>>('ResourceOwnership<Course>').toDynamicValue(() => new ResourceOwnership<Course>('Course')).inSingletonScope();
container.bind<CourseController>('CourseController').to(CourseController).inSingletonScope();
