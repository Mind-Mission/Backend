import { container } from '../container/DIContainer';
import { IUserCredentialsService } from '../../../application/interfaces/IServices/IUserCredentialsService';
import { UserCredentialsService } from '../../../application/services/UserCredentialsService';
import { UserCredentialsController } from '../../controllers/UserCredentialsController';

container.bind<IUserCredentialsService>('IUserCredentialsService').to(UserCredentialsService).inSingletonScope();
container.bind<UserCredentialsController>('UserCredentialsController').to(UserCredentialsController).inSingletonScope();
