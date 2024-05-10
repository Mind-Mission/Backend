import { container } from '../container/DIContainer';
import { ICommentRepository } from '../../../application/interfaces/IRepositories/i-comment.repository';
import { CommentRepository } from '../../../infrastructure/repositories/comment.repository';
import { ICommentService } from '../../../application/interfaces/IServices/ICommentService';
import { CommentService } from '../../../application/services/CommentService';
import { CommentController } from '../../controllers/CommentController';

container.bind<ICommentRepository>('ICommentRepository').to(CommentRepository).inSingletonScope();
container.bind<ICommentService>('ICommentService').to(CommentService).inSingletonScope();
container.bind<CommentController>('CommentController').to(CommentController).inSingletonScope();