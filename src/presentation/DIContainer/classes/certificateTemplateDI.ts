import { container } from '../container/DIContainer';
import { ICertificateTemplateRepository } from '../../../application/interfaces/IRepositories/ICertificateTemplateRepository';
import { CertificateTemplateRepository } from '../../../infrastructure/repositories/CertificateTemplateRepository';
import { ICertificateTemplateService } from '../../../application/interfaces/IServices/ICertificateTemplateService';
import { CertificateTemplateService } from '../../../application/services/CertificateTemplateService';
import { CertificateTemplateController } from '../../controllers/CertificateTemplateController';

container.bind<ICertificateTemplateRepository>('ICertificateTemplateRepository').to(CertificateTemplateRepository).inSingletonScope();
container.bind<ICertificateTemplateService>('ICertificateTemplateService').to(CertificateTemplateService).inSingletonScope();
container.bind<CertificateTemplateController>('CertificateTemplateController').to(CertificateTemplateController).inSingletonScope();
