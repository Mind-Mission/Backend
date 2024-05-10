import { container } from '../container/DIContainer';
import { ICertificateRepository } from '../../../application/interfaces/IRepositories/i-certificate.repository';
import { CertificateRepository } from '../../../infrastructure/repositories/certificate.repository';
import { ICertificateService } from '../../../application/interfaces/IServices/i-certificate-service';
import { CertificateService } from '../../../application/services/certificate.service';
import { CertificateController } from '../../controllers/CertificateController';

container.bind<ICertificateRepository>('ICertificateRepository').to(CertificateRepository).inSingletonScope();
container.bind<ICertificateService>('ICertificateService').to(CertificateService).inSingletonScope();
container.bind<CertificateController>('CertificateController').to(CertificateController).inSingletonScope();
