import { container } from '../container/DIContainer';
import { ICartRepository } from '../../../application/interfaces/IRepositories/i-cart.repository';
import { CartRepository } from '../../../infrastructure/repositories/cart.repository';
import { ICartService } from '../../../application/interfaces/IServices/ICartService';
import { CartService } from '../../../application/services/CartService';
import { CartController } from '../../controllers/CartController';

container.bind<ICartRepository>('ICartRepository').to(CartRepository).inSingletonScope();
container.bind<ICartService>('ICartService').to(CartService).inSingletonScope();
container.bind<CartController>('CartController').to(CartController).inSingletonScope();
