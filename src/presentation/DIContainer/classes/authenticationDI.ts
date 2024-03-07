import { container } from '../container/DIContainer';
import { IAuthenticationService } from '../../../application/interfaces/IServices/IAuthenticationService';
import { AuthenticationService } from '../../../application/services/AuthenticationService';
import { AuthenticationController } from '../../controllers/AuthenticationController';

container.bind<IAuthenticationService>('IAuthenticationService').to(AuthenticationService).inSingletonScope();
container.bind<AuthenticationController>('AuthenticationController').to(AuthenticationController).inSingletonScope();