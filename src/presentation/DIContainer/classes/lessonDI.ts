import { Lesson } from '@prisma/client';
import { container } from '../container/DIContainer';
import { ILessonRepository } from '../../../application/interfaces/IRepositories/i-lesson.repository';
import { LessonRepository } from '../../../infrastructure/repositories/lesson.repository';
import { ILessonService } from '../../../application/interfaces/IServices/i-lesson.service';
import { LessonService } from '../../../application/services/lesson.service';
import { IResourceOwnershipService } from '../../../application/interfaces/IServices/i-resource-ownership.service';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';
import { LessonController } from '../../controllers/LessonController';

container.bind<ILessonRepository>('ILessonRepository').to(LessonRepository).inSingletonScope();
container.bind<ILessonService>('ILessonService').to(LessonService).inSingletonScope();
container.bind<IResourceOwnershipService<Lesson>>('IResourceOwnership<Lesson>').to(LessonService).inSingletonScope();
container.bind<ResourceOwnership<Lesson>>('ResourceOwnership<Lesson>').toDynamicValue(() => new ResourceOwnership<Lesson>('Lesson')).inSingletonScope();
container.bind<LessonController>('LessonController').to(LessonController).inSingletonScope();
