import { container } from '../container/DIContainer';
import { EnumController } from '../../controllers/EnumController';

container.bind<EnumController>('EnumController').to(EnumController).inSingletonScope();
