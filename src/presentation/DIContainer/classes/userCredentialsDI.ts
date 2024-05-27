import { container } from '../container/DIContainer';
import { IUserCredentialsService } from '../../../application/interfaces/IServices/i-user-credentials.service';
import { UserCredentialsService } from '../../../application/services/user-credentials.service';
import { UserCredentialsController } from '../../controllers/UserCredentialsController';

container.bind<IUserCredentialsService>('IUserCredentialsService').to(UserCredentialsService).inSingletonScope();
container.bind<UserCredentialsController>('UserCredentialsController').to(UserCredentialsController).inSingletonScope();
