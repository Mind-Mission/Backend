import { Section } from '@prisma/client';
import { container } from '../container/DIContainer';
import { ISectionRepository } from '../../../application/interfaces/IRepositories/i-section.repository';
import { SectionRepository } from '../../../infrastructure/repositories/section.repository';
import { ISectionService } from '../../../application/interfaces/IServices/ISectionService';
import { SectionService } from '../../../application/services/SectionService';
import { IResourceOwnership } from '../../../application/interfaces/IServices/IResourceOwnership';
import { ResourceOwnership } from '../../middlewares/ResourceOwnership/ResourceOwnership.';
import { SectionController } from '../../controllers/SectionController';

container.bind<ISectionRepository>('ISectionRepository').to(SectionRepository).inSingletonScope();
container.bind<ISectionService>('ISectionService').to(SectionService).inSingletonScope();
container.bind<IResourceOwnership<Section>>('IResourceOwnership<Section>').to(SectionService).inSingletonScope();
container.bind<ResourceOwnership<Section>>('ResourceOwnership<Section>').toDynamicValue(() => new ResourceOwnership<Section>('Section')).inSingletonScope();
container.bind<SectionController>('SectionController').to(SectionController).inSingletonScope();
