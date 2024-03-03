import { Lesson } from '@prisma/client';
import { container } from '../container/DIContainer';
import { ILessonRepository } from '../../../application/interfaces/IRepositories/ILessonRepository';
import { LessonRepository } from '../../../infrastructure/repositories/LessonRepository';
import { ILessonService } from '../../../application/interfaces/IServices/ILessonService';
import { LessonService } from '../../../application/services/LessonService';
import { IResourceOwnership } from '../../../application/interfaces/IServices/IResourceOwnership';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';
import { LessonController } from '../../controllers/LessonController';

container.bind<ILessonRepository>('ILessonRepository').to(LessonRepository).inSingletonScope();
container.bind<ILessonService>('ILessonService').to(LessonService).inSingletonScope();
container.bind<IResourceOwnership<Lesson>>('IResourceOwnership<Lesson>').to(LessonService).inSingletonScope();
container.bind<ResourceOwnership<Lesson>>('ResourceOwnership<Lesson>').toDynamicValue(() => new ResourceOwnership<Lesson>('Lesson')).inSingletonScope();
container.bind<LessonController>('LessonController').to(LessonController).inSingletonScope();
