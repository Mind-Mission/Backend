import { container } from '../container/DIContainer';
import { ILessonRepository } from '../../../application/interfaces/IRepositories/ILessonRepository';
import { LessonRepository } from '../../../infrastructure/repositories/LessonRepository';
import { ILessonService } from '../../../application/interfaces/IServices/ILessonService';
import { LessonService } from '../../../application/services/LessonService';
import { LessonController } from '../../controllers/LessonController';

container.bind<ILessonRepository>('ILessonRepository').to(LessonRepository).inSingletonScope();
container.bind<ILessonService>('ILessonService').to(LessonService).inSingletonScope();
container.bind<LessonController>('LessonController').to(LessonController).inSingletonScope();
