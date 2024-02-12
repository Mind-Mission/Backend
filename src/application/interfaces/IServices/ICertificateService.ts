import { Prisma, Certificate } from "@prisma/client";
import { CreateCertificate, UpdateCertificate } from "../../inputs/certificateInput";
import { TransactionType } from "../../types/TransactionType";

export interface ICertificateService {
  count(args: Prisma.CertificateCountArgs): Promise<number>;
  findMany(args: Prisma.CertificateFindManyArgs): Promise<Certificate[]>;
  findUnique(args: Prisma.CertificateFindUniqueArgs): Promise<Certificate | null>
  create(args: {data: CreateCertificate, select?: Prisma.CertificateSelect, include?: Prisma.CertificateInclude}, transaction?: TransactionType): Promise<Certificate>;
  update(args: {data: UpdateCertificate, select?: Prisma.CertificateSelect, include?: Prisma.CertificateInclude}, transaction?: TransactionType): Promise<Certificate>;
  delete(id: number, transaction?: TransactionType): Promise<Certificate>;
}