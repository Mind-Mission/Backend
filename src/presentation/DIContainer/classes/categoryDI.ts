import { container } from '../container/DIContainer';
import { ICategoryRepository } from '../../../application/interfaces/IRepositories/ICategoryRepository';
import { CategoryRepository } from '../../../infrastructure/repositories/CategoryRepository';
import { ICategoryService } from '../../../application/interfaces/IServices/ICategoryService';
import { CategoryService } from '../../../application/services/CategoryService';
import { CategoryController } from '../../controllers/CategoryController';

container.bind<ICategoryRepository>('ICategoryRepository').to(CategoryRepository).inSingletonScope();
container.bind<ICategoryService>('ICategoryService').to(CategoryService).inSingletonScope();
container.bind<CategoryController>('CategoryController').to(CategoryController).inSingletonScope();
