import { container } from '../container/DIContainer';
import { IRatingRepository } from '../../../application/interfaces/IRepositories/IRatingRepository';
import { RatingRepository } from '../../../infrastructure/repositories/RatingRepository';
import { IRatingService } from '../../../application/interfaces/IServices/IRatingService';
import { RatingService } from '../../../application/services/RatingService';
import { RatingController } from '../../controllers/RatingController';

container.bind<IRatingRepository>('IRatingRepository').to(RatingRepository).inSingletonScope();
container.bind<IRatingService>('IRatingService').to(RatingService).inSingletonScope();
container.bind<RatingController>('RatingController').to(RatingController).inSingletonScope();
