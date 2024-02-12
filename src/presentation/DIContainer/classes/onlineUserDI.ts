import { container } from '../container/DIContainer';
import { IOnlineUserRepository } from '../../../application/interfaces/IRepositories/IOnlineUserRepository';
import { OnlineUserRepository } from '../../../infrastructure/repositories/OnlineUserRepository';
import { IOnlineUserService } from '../../../application/interfaces/IServices/IOnlineUserService';
import { OnlineUserService } from '../../../application/services/OnlineUserService';

container.bind<IOnlineUserRepository>('IOnlineUserRepository').to(OnlineUserRepository).inSingletonScope();
container.bind<IOnlineUserService>('IOnlineUserService').to(OnlineUserService).inSingletonScope();