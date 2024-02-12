import { CertificateTemplate, Prisma } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface ICertificateTemplateRepository extends IBaseRepository<CertificateTemplate> {
  findFirst(args: Prisma.CertificateTemplateFindFirstArgs): Promise<CertificateTemplate | null>;
}