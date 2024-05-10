import { container } from '../container/DIContainer';
import { IAuthenticationService } from '../../../application/interfaces/IServices/i-authentication.service';
import { AuthenticationService } from '../../../application/services/authentication.service';
import { AuthenticationController } from '../../controllers/AuthenticationController';

container.bind<IAuthenticationService>('IAuthenticationService').to(AuthenticationService).inSingletonScope();
container.bind<AuthenticationController>('AuthenticationController').to(AuthenticationController).inSingletonScope();