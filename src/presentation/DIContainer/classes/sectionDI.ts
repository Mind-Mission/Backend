import { Section } from '@prisma/client';
import { container } from '../container/DIContainer';
import { ISectionRepository } from '../../../application/interfaces/IRepositories/i-section.repository';
import { SectionRepository } from '../../../infrastructure/repositories/section.repository';
import { ISectionService } from '../../../application/interfaces/IServices/i-section.service';
import { SectionService } from '../../../application/services/section.service';
import { IResourceOwnershipService } from '../../../application/interfaces/IServices/i-resource-ownership.service';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';
import { SectionController } from '../../controllers/SectionController';

container.bind<ISectionRepository>('ISectionRepository').to(SectionRepository).inSingletonScope();
container.bind<ISectionService>('ISectionService').to(SectionService).inSingletonScope();
container.bind<IResourceOwnershipService<Section>>('IResourceOwnership<Section>').to(SectionService).inSingletonScope();
container.bind<ResourceOwnership<Section>>('ResourceOwnership<Section>').toDynamicValue(() => new ResourceOwnership<Section>('Section')).inSingletonScope();
container.bind<SectionController>('SectionController').to(SectionController).inSingletonScope();
