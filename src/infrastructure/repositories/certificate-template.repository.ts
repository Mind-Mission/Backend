import { CertificateTemplate, Prisma } from "@prisma/client";
import { injectable } from "inversify";
import { BaseRepository } from "./Base/base.repository";
import { ICertificateTemplateRepository } from "../../application/interfaces/IRepositories/i-certificate-template.repository";

@injectable()
export class CertificateTemplateRepository extends BaseRepository<CertificateTemplate> implements ICertificateTemplateRepository{
  constructor() {
    super("CertificateTemplate");
  }

  findFirst(args: Prisma.CertificateTemplateFindFirstArgs): Promise<CertificateTemplate | null> {
    return this.prismaModel.findFirst(args);
  }
}