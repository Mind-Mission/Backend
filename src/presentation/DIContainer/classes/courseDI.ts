import { Course } from '@prisma/client';
import { container } from '../container/DIContainer';
import { ICourseRepository } from '../../../application/interfaces/IRepositories/i-course.repository';
import { CourseRepository } from '../../../infrastructure/repositories/course.repository';
import { ICourseService } from '../../../application/interfaces/IServices/i-course.service';
import { CourseService } from '../../../application/services/course.service';
import { IResourceOwnershipService } from '../../../application/interfaces/IServices/i-resource-ownership.service';
import { CourseController } from '../../controllers/CourseController';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';

container.bind<ICourseRepository>('ICourseRepository').to(CourseRepository).inSingletonScope();
container.bind<ICourseService>('ICourseService').to(CourseService).inSingletonScope();
container.bind<IResourceOwnershipService<Course>>('IResourceOwnership<Course>').to(CourseService).inSingletonScope();
container.bind<ResourceOwnership<Course>>('ResourceOwnership<Course>').toDynamicValue(() => new ResourceOwnership<Course>('Course')).inSingletonScope();
container.bind<CourseController>('CourseController').to(CourseController).inSingletonScope();
