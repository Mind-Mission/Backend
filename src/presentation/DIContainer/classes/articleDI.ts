import { container } from '../container/DIContainer';
import { IArticleRepository } from '../../../application/interfaces/IRepositories/IArticleRepository';
import { ArticleRepository } from '../../../infrastructure/repositories/ArticleRepository';
import { IArticleService } from '../../../application/interfaces/IServices/IArticleService';
import { ArticleService } from '../../../application/services/ArticleService';
import { ArticleController } from '../../controllers/ArticleController';

container.bind<IArticleRepository>('IArticleRepository').to(ArticleRepository).inSingletonScope();
container.bind<IArticleService>('IArticleService').to(ArticleService).inSingletonScope();
container.bind<ArticleController>('ArticleController').to(ArticleController).inSingletonScope();
