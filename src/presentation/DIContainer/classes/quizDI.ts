import { Quiz } from '@prisma/client';
import { container } from '../container/DIContainer';
import { IQuizRepository } from '../../../application/interfaces/IRepositories/i-quiz.repository';
import { QuizRepository } from '../../../infrastructure/repositories/quiz.repository';
import { IQuizService } from '../../../application/interfaces/IServices/i-quiz.service';
import { QuizService } from '../../../application/services/quiz.service';
import { IResourceOwnershipService } from '../../../application/interfaces/IServices/i-resource-ownership.service';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';
import { QuizController } from '../../controllers/QuizController';

container.bind<IQuizRepository>('IQuizRepository').to(QuizRepository).inSingletonScope();
container.bind<IQuizService>('IQuizService').to(QuizService).inSingletonScope();
container.bind<IResourceOwnershipService<Quiz>>('IResourceOwnership<Quiz>').to(QuizService).inSingletonScope();
container.bind<ResourceOwnership<Quiz>>('ResourceOwnership<Quiz>').toDynamicValue(() => new ResourceOwnership<Quiz>('Quiz')).inSingletonScope();
container.bind<QuizController>('QuizController').to(QuizController).inSingletonScope();
