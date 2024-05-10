import { container } from '../container/DIContainer';
import { ICertificateRepository } from '../../../application/interfaces/IRepositories/i-certificate.repository';
import { CertificateRepository } from '../../../infrastructure/repositories/certificate.repository';
import { ICertificateService } from '../../../application/interfaces/IServices/ICertificateService';
import { CertificateService } from '../../../application/services/CertificateService';
import { CertificateController } from '../../controllers/CertificateController';

container.bind<ICertificateRepository>('ICertificateRepository').to(CertificateRepository).inSingletonScope();
container.bind<ICertificateService>('ICertificateService').to(CertificateService).inSingletonScope();
container.bind<CertificateController>('CertificateController').to(CertificateController).inSingletonScope();
