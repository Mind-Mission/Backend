import { container } from '../container/DIContainer';
import { IMessageRepository } from '../../../application/interfaces/IRepositories/i-message.repository';
import { MessageRepository } from '../../../infrastructure/repositories/message.repository';
import { IMessageService } from '../../../application/interfaces/IServices/i-message.service';
import { MessageService } from '../../../application/services/message.service';
import { MessageController } from '../../controllers/MessageController';

container.bind<IMessageRepository>('IMessageRepository').to(MessageRepository).inSingletonScope();
container.bind<IMessageService>('IMessageService').to(MessageService).inSingletonScope();
container.bind<MessageController>('MessageController').to(MessageController).inSingletonScope();
