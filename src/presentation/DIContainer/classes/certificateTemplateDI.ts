import { container } from '../container/DIContainer';
import { ICertificateTemplateRepository } from '../../../application/interfaces/IRepositories/i-certificate-template.repository';
import { CertificateTemplateRepository } from '../../../infrastructure/repositories/certificate-template.repository';
import { ICertificateTemplateService } from '../../../application/interfaces/IServices/i-certificate-template.service';
import { CertificateTemplateService } from '../../../application/services/certificate-template.service';
import { CertificateTemplateController } from '../../controllers/CertificateTemplateController';

container.bind<ICertificateTemplateRepository>('ICertificateTemplateRepository').to(CertificateTemplateRepository).inSingletonScope();
container.bind<ICertificateTemplateService>('ICertificateTemplateService').to(CertificateTemplateService).inSingletonScope();
container.bind<CertificateTemplateController>('CertificateTemplateController').to(CertificateTemplateController).inSingletonScope();
