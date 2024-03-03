import { Quiz } from '@prisma/client';
import { container } from '../container/DIContainer';
import { IQuizRepository } from '../../../application/interfaces/IRepositories/IQuizRepository';
import { QuizRepository } from '../../../infrastructure/repositories/QuizRepository';
import { IQuizService } from '../../../application/interfaces/IServices/IQuizService';
import { QuizService } from '../../../application/services/QuizService';
import { IResourceOwnership } from '../../../application/interfaces/IServices/IResourceOwnership';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';
import { QuizController } from '../../controllers/QuizController';

container.bind<IQuizRepository>('IQuizRepository').to(QuizRepository).inSingletonScope();
container.bind<IQuizService>('IQuizService').to(QuizService).inSingletonScope();
container.bind<IResourceOwnership<Quiz>>('IResourceOwnership<Quiz>').to(QuizService).inSingletonScope();
container.bind<ResourceOwnership<Quiz>>('ResourceOwnership<Quiz>').toDynamicValue(() => new ResourceOwnership<Quiz>('Quiz')).inSingletonScope();
container.bind<QuizController>('QuizController').to(QuizController).inSingletonScope();
