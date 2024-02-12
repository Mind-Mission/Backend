import { container } from '../container/DIContainer';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { UserService } from '../../../application/services/UserService';
import { IUserRepository } from '../../../application/interfaces/IRepositories/IUserRepository';
import { IUserService } from '../../../application/interfaces/IServices/IUserService';
import { UserController } from '../../controllers/UserController';

container.bind<IUserRepository>('IUserRepository').to(UserRepository).inSingletonScope();
container.bind<IUserService>('IUserService').to(UserService).inSingletonScope();
container.bind<UserController>('UserController').to(UserController).inSingletonScope();
