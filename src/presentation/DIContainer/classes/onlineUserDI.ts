import { container } from '../container/DIContainer';
import { IOnlineUserRepository } from '../../../application/interfaces/IRepositories/i-online-user.repository';
import { OnlineUserRepository } from '../../../infrastructure/repositories/online-user.repository';
import { IOnlineUserService } from '../../../application/interfaces/IServices/i-online-user.service';
import { OnlineUserService } from '../../../application/services/online-user.service';

container.bind<IOnlineUserRepository>('IOnlineUserRepository').to(OnlineUserRepository).inSingletonScope();
container.bind<IOnlineUserService>('IOnlineUserService').to(OnlineUserService).inSingletonScope();