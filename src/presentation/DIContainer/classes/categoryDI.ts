import { container } from '../container/DIContainer';
import { ICategoryRepository } from '../../../application/interfaces/IRepositories/i-category.repository';
import { CategoryRepository } from '../../../infrastructure/repositories/category.repository';
import { ICategoryService } from '../../../application/interfaces/IServices/i-category.service';
import { CategoryService } from '../../../application/services/category.service';
import { CategoryController } from '../../controllers/CategoryController';

container.bind<ICategoryRepository>('ICategoryRepository').to(CategoryRepository).inSingletonScope();
container.bind<ICategoryService>('ICategoryService').to(CategoryService).inSingletonScope();
container.bind<CategoryController>('CategoryController').to(CategoryController).inSingletonScope();
