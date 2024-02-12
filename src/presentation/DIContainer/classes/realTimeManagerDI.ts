import { container } from '../container/DIContainer';
import { RealTimeManager } from '../../services/RealTimeManager';

container.bind<RealTimeManager>('RealTimeManager').to(RealTimeManager).inSingletonScope();
