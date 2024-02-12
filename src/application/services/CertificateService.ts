import crypto from 'crypto';
import { Prisma, Certificate, CertificateTemplate } from "@prisma/client"
import {inject, injectable } from "inversify"
import { ICertificateService } from "../interfaces/IServices/ICertificateService"
import { ICertificateRepository } from "../interfaces/IRepositories/ICertificateRepository"
import { IEnrollmentRepository } from "../interfaces/IRepositories/IEnrollmentRepository"
import { ICertificateTemplateService } from '../interfaces/IServices/ICertificateTemplateService';
import { CreateCertificate, UpdateCertificate } from "../inputs/certificateInput"
import { TransactionType } from "../types/TransactionType"
import APIError from "../../presentation/errorHandlers/APIError"
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode"
import { CertificateInfo } from '../../presentation/types/CertificateInfo';

@injectable()
export class CertificateService implements ICertificateService {
	constructor(@inject('ICertificateRepository') private certificateRepository: ICertificateRepository, @inject('ICertificateTemplateService') private certificateTemplateService: ICertificateTemplateService, @inject('IEnrollmentRepository') private enrollmentRepository: IEnrollmentRepository) {};

  private async getEnrollmentInfo(courseId: number, studentId: number): Promise<{instructorName: string, studentName: string, courseTitle: string, courseHours: number}> {
    const enrollment = await this.enrollmentRepository.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        }
      },
      select: {
        student: {
          select: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        },
        course: {
          select: {
            title: true,
            hours: true,
            instructor: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  }
                }
              }
            }
          }
        }
      }
    }) as any;
    if(!enrollment) {
      throw new APIError('This student is not enrolled in this course', HttpStatusCode.BadRequest);
    }
    return {
      courseTitle: enrollment.course.title,
      courseHours: enrollment.course.hours,
      instructorName: `${enrollment.course.instructor.user.firstName} ${enrollment.course.instructor.user.lastName}`,
      studentName:`${enrollment.student.user.firstName} ${enrollment.student.user.lastName}`
    }
  };

  private async generateCertificateCode(): Promise<string> {
    const certificateCode = crypto.randomUUID();
    const isCodeExist = await this.findUnique({
      where: {
        certificateCode
      },
      select: {
        certificateCode: true
      }
    });
    if(isCodeExist) {
      return await this.generateCertificateCode();
    }
    return certificateCode;
  };

  private async getCertificateTemplate(): Promise<CertificateTemplate | null> {
    return await this.certificateTemplateService.findFirst({
      where: {
        isDefault: true
      },
      select: {
        templateURL: true
      }
    })
  }

  private async generateCertificate(certificate: CertificateInfo, templateURL: string) {
    const generateCertificateURL = process.env.Generate_Certificate_URL as string;
    const response = await fetch(generateCertificateURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...certificate,
        templateURL
      })
    });
    if(response.status !== HttpStatusCode.Created) {
      const error = await response.json();
      throw error;
    }
    const result = await response.json();
    return result.data[0];
  }

	count(args: Prisma.CertificateCountArgs): Promise<number> {
		return this.certificateRepository.count(args);
	};

	findMany(args: Prisma.CertificateFindManyArgs): Promise<Certificate[]> {
		return this.certificateRepository.findMany(args);
	};

	findUnique(args: Prisma.CertificateFindUniqueArgs): Promise<Certificate | null> {
		return this.certificateRepository.findUnique(args);
	};

	async create(args: {data: CreateCertificate, select?: Prisma.CertificateSelect, include?: Prisma.CertificateInclude}, transaction?: TransactionType): Promise<Certificate> {
		const {courseId, studentId} = args.data;
    const isCertificateExist = await this.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
      select: args.select,
      include: args.include
    });
    if(isCertificateExist) {
      return isCertificateExist;
    }
    const certificateTemplate = await this.getCertificateTemplate();
    if(!certificateTemplate) {
      throw new APIError('Their is no default template can be used to generate a certificate, please contact with admin to provide one', HttpStatusCode.BadRequest);
    }
    const {courseTitle, courseHours, instructorName, studentName} = await this.getEnrollmentInfo(courseId, studentId);
    const certificateCode = await this.generateCertificateCode();
    const {imgUrl, pdfUrl} = await this.generateCertificate({certificateCode, courseTitle, courseHours, instructorName, studentName}, certificateTemplate.templateURL);
		return this.certificateRepository.create({
      data: {
        courseTitle,
        courseHours,
        instructorName,
        studentName,
        certificateCode,
        imgUrl,
        pdfUrl,
        course: {
          connect: {
            id: courseId
          }
        },
        student: {
          connect: {
            id: studentId
          }
        }
      },
      select: args.select,
      include: args.include
    }, transaction);
	};

	async update(args: {data: UpdateCertificate, select?: Prisma.CertificateSelect, include?: Prisma.CertificateInclude}, transaction?: TransactionType): Promise<Certificate> {
		const {id, imgUrl, pdfUrl} = args.data;
		return this.certificateRepository.update({
      where: {
        id
      },
      update: {
        imgUrl,
        pdfUrl
      },
      select: args.select,
      include: args.include
    }, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<Certificate> {
		return this.certificateRepository.delete(id, transaction);
	};
}