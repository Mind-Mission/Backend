import { Article } from '@prisma/client';
import { container } from '../container/DIContainer';
import { IArticleRepository } from '../../../application/interfaces/IRepositories/i-article.repository';
import { ArticleRepository } from '../../../infrastructure/repositories/article.repository';
import { IArticleService } from '../../../application/interfaces/IServices/i-article.service';
import { ArticleService } from '../../../application/services/article.service';
import { IResourceOwnershipService } from '../../../application/interfaces/IServices/i-resource-ownership.service';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';
import { ArticleController } from '../../controllers/ArticleController';

container.bind<IArticleRepository>('IArticleRepository').to(ArticleRepository).inSingletonScope();
container.bind<IArticleService>('IArticleService').to(ArticleService).inSingletonScope();
container.bind<IResourceOwnershipService<Article>>('IResourceOwnership<Article>').to(ArticleService).inSingletonScope();
container.bind<ResourceOwnership<Article>>('ResourceOwnership<Article>').toDynamicValue(() => new ResourceOwnership<Article>('Article')).inSingletonScope();
container.bind<ArticleController>('ArticleController').to(ArticleController).inSingletonScope();
