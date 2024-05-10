import { container } from '../container/DIContainer';
import { ILogRepository } from '../../../application/interfaces/IRepositories/i-log.repository';
import { LogRepository } from '../../../infrastructure/repositories/log.repository';
import { ILogService } from '../../../application/interfaces/IServices/i-log.service';
import { LogService } from '../../../application/services/log.service';
import { LogController } from '../../controllers/LogController';

container.bind<ILogRepository>('ILogRepository').to(LogRepository).inSingletonScope();
container.bind<ILogService>('ILogService').to(LogService).inSingletonScope();
container.bind<LogController>('LogController').to(LogController).inSingletonScope();