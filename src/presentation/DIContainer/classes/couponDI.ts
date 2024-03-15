import { Coupon } from '@prisma/client';
import { container } from '../container/DIContainer';
import { ICouponRepository } from '../../../application/interfaces/IRepositories/ICouponRepository';
import { CouponRepository } from '../../../infrastructure/repositories/CouponRepository';
import { ICouponService } from '../../../application/interfaces/IServices/ICouponService';
import { CouponService } from '../../../application/services/CouponService';
import { IResourceOwnership } from '../../../application/interfaces/IServices/IResourceOwnership';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';
import { CouponController } from '../../controllers/CouponController';

container.bind<ICouponRepository>('ICouponRepository').to(CouponRepository).inSingletonScope();
container.bind<ICouponService>('ICouponService').to(CouponService).inSingletonScope();
container.bind<IResourceOwnership<Coupon>>('IResourceOwnership<Coupon>').to(CouponService).inSingletonScope();
container.bind<ResourceOwnership<Coupon>>('ResourceOwnership<Coupon>').toDynamicValue(() => new ResourceOwnership<Coupon>('Coupon')).inSingletonScope();
container.bind<CouponController>('CouponController').to(CouponController).inSingletonScope();
