import { container } from '../container/DIContainer';
import { INoteRepository } from '../../../application/interfaces/IRepositories/i-note.repository';
import { NoteRepository } from '../../../infrastructure/repositories/note.respository';
import { INoteService } from '../../../application/interfaces/IServices/i-note-service';
import { NoteService } from '../../../application/services/note.service';
import { NoteController } from '../../controllers/NoteController';

container.bind<INoteRepository>('INoteRepository').to(NoteRepository).inSingletonScope();
container.bind<INoteService>('INoteService').to(NoteService).inSingletonScope();
container.bind<NoteController>('NoteController').to(NoteController).inSingletonScope();
