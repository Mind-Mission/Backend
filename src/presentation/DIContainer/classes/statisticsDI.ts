import { container } from '../container/DIContainer';
import { StatisticsController } from '../../controllers/StatisticsController';

container.bind<StatisticsController>('StatisticsController').to(StatisticsController).inSingletonScope();