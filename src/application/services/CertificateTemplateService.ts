import { Prisma, CertificateTemplate } from "@prisma/client"
import {inject, injectable } from "inversify"
import { ICertificateTemplateService } from "../interfaces/IServices/ICertificateTemplateService"
import { ICertificateTemplateRepository } from "../interfaces/IRepositories/ICertificateTemplateRepository"
import { CreateCertificateTemplate, UpdateCertificateTemplate } from "../inputs/certificateTemplateInput"
import { TransactionType } from "../types/TransactionType"

@injectable()
export class CertificateTemplateService implements ICertificateTemplateService {
	constructor(@inject('ICertificateTemplateRepository') private certificateTemplateRepository: ICertificateTemplateRepository) {}

	count(args: Prisma.CertificateTemplateCountArgs): Promise<number> {
		return this.certificateTemplateRepository.count(args);
	};

	findMany(args: Prisma.CertificateTemplateFindManyArgs): Promise<CertificateTemplate[]> {
		return this.certificateTemplateRepository.findMany(args);
	};

	findUnique(args: Prisma.CertificateTemplateFindUniqueArgs): Promise<CertificateTemplate | null> {
		return this.certificateTemplateRepository.findUnique(args);
	};

	findFirst(args: Prisma.CertificateTemplateFindFirstArgs): Promise<CertificateTemplate | null> {
		return this.certificateTemplateRepository.findFirst(args);
	};

	create(args: {data: CreateCertificateTemplate, select?: Prisma.CertificateTemplateSelect}, transaction?: TransactionType): Promise<CertificateTemplate> {
		const {templateURL, isDefault} = args.data;
		return this.certificateTemplateRepository.create({
      data: {
        templateURL,
        isDefault
      },
      select: args.select,
    }, transaction);
	};

	update(args: {data: UpdateCertificateTemplate, select?: Prisma.CertificateTemplateSelect}, transaction?: TransactionType): Promise<CertificateTemplate> {
		const {id, templateURL, isDefault} = args.data;
		return this.certificateTemplateRepository.update({
      where: {
        id
      },
      update: {
        templateURL,
        isDefault
      },
      select: args.select,
    }, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<CertificateTemplate> {
		return this.certificateTemplateRepository.delete(id, transaction);
	};
}