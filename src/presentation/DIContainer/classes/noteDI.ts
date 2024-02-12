import { container } from '../container/DIContainer';
import { INoteRepository } from '../../../application/interfaces/IRepositories/INoteRepository';
import { NoteRepository } from '../../../infrastructure/repositories/NoteRespository';
import { INoteService } from '../../../application/interfaces/IServices/INoteService';
import { NoteService } from '../../../application/services/NoteService';
import { NoteController } from '../../controllers/NoteController';

container.bind<INoteRepository>('INoteRepository').to(NoteRepository).inSingletonScope();
container.bind<INoteService>('INoteService').to(NoteService).inSingletonScope();
container.bind<NoteController>('NoteController').to(NoteController).inSingletonScope();
