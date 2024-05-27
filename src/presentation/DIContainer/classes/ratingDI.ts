import { container } from '../container/DIContainer';
import { IRatingRepository } from '../../../application/interfaces/IRepositories/i-rating.repository';
import { RatingRepository } from '../../../infrastructure/repositories/rating.repository';
import { IRatingService } from '../../../application/interfaces/IServices/i-rating.service';
import { RatingService } from '../../../application/services/rating.service';
import { RatingController } from '../../controllers/RatingController';

container.bind<IRatingRepository>('IRatingRepository').to(RatingRepository).inSingletonScope();
container.bind<IRatingService>('IRatingService').to(RatingService).inSingletonScope();
container.bind<RatingController>('RatingController').to(RatingController).inSingletonScope();
