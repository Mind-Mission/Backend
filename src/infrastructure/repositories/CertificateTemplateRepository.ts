import { CertificateTemplate, Prisma } from "@prisma/client";
import { injectable } from "inversify";
import { BaseRepository } from "./Base/BaseRepository";
import { ICertificateTemplateRepository } from "../../application/interfaces/IRepositories/ICertificateTemplateRepository";

@injectable()
export class CertificateTemplateRepository extends BaseRepository<CertificateTemplate> implements ICertificateTemplateRepository{
  constructor() {
    super("CertificateTemplate");
  }

  findFirst(args: Prisma.CertificateTemplateFindFirstArgs): Promise<CertificateTemplate | null> {
    return this.prismaModel.findFirst(args);
  }
}