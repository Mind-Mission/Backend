import { container } from '../container/DIContainer';
import { IQuizRepository } from '../../../application/interfaces/IRepositories/IQuizRepository';
import { QuizRepository } from '../../../infrastructure/repositories/QuizRepository';
import { IQuizService } from '../../../application/interfaces/IServices/IQuizService';
import { QuizService } from '../../../application/services/QuizService';
import { QuizController } from '../../controllers/QuizController';

container.bind<IQuizRepository>('IQuizRepository').to(QuizRepository).inSingletonScope();
container.bind<IQuizService>('IQuizService').to(QuizService).inSingletonScope();
container.bind<QuizController>('QuizController').to(QuizController).inSingletonScope();
