import { Prisma, CertificateTemplate } from "@prisma/client";
import { CreateCertificateTemplate, UpdateCertificateTemplate } from "../../inputs/certificateTemplateInput";
import { TransactionType } from "../../types/TransactionType";

export interface ICertificateTemplateService {
  count(args: Prisma.CertificateTemplateCountArgs): Promise<number>;
  findMany(args: Prisma.CertificateTemplateFindManyArgs): Promise<CertificateTemplate[]>;
  findUnique(args: Prisma.CertificateTemplateFindUniqueArgs): Promise<CertificateTemplate | null>
  findFirst(args: Prisma.CertificateTemplateFindFirstArgs): Promise<CertificateTemplate | null>
  create(args: {data: CreateCertificateTemplate, select?: Prisma.CertificateTemplateSelect}, transaction?: TransactionType): Promise<CertificateTemplate>;
  update(args: {data: UpdateCertificateTemplate, select?: Prisma.CertificateTemplateSelect}, transaction?: TransactionType): Promise<CertificateTemplate>;
  delete(id: number, transaction?: TransactionType): Promise<CertificateTemplate>;
}