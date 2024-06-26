import { Prisma, Enrollment } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ExtendedEnrollment } from "../interfaces/extended/enrollment.extend";
import { UpdateEnrollment } from "../inputs/enrollment.input";
import {IEnrollmentRepository} from "../interfaces/IRepositories/i-enrollment.repository";
import {IEnrollmentService} from "../interfaces/IServices/i-enrollment.service";
import { ICertificateService } from "../interfaces/IServices/i-certificate-service";
import { TransactionType } from "../interfaces/extended/transaction-type.extend";
import { Transaction } from "../../infrastructure/services/Transaction";

@injectable()
export class EnrollmentService implements IEnrollmentService {
	constructor(@inject('IEnrollmentRepository') private enrollmentRepository: IEnrollmentRepository, @inject('ICertificateService') private certificateService: ICertificateService) {}

  private calcCurrentProgress(courseHours: number, completedLessonsTime: {time: number}[]): number {
    const totalTimeForCompletedLessons = completedLessonsTime.reduce((curr, acc) => curr + acc.time, 0);
    const progress = +((totalTimeForCompletedLessons / courseHours) * 100).toFixed();
    return progress > 100 ? 100 : progress;
  };

  private async createStudentCertificate(studentId: number, courseId: number, transaction: TransactionType) {
    await this.certificateService.create({
      data: {
        studentId,
        courseId,
      },
      select: {
        id: true,
      }
    }, transaction);
  }

	count(args: Prisma.EnrollmentCountArgs): Promise<number> {
		return this.enrollmentRepository.count(args);
	};

	findMany(args: Prisma.EnrollmentFindManyArgs): Promise<ExtendedEnrollment[]> {
		return this.enrollmentRepository.findMany(args);
	};

	findUnique(args: Prisma.EnrollmentFindUniqueArgs): Promise<ExtendedEnrollment | null> {
		return this.enrollmentRepository.findUnique(args);
	};

  findFirst(args: Prisma.EnrollmentFindFirstArgs): Promise<ExtendedEnrollment | null> {
    return this.enrollmentRepository.findFirst(args);
  };

	async update(args: {data: UpdateEnrollment, select?: Prisma.EnrollmentSelect, include?: Prisma.EnrollmentInclude}, transaction?: TransactionType): Promise<ExtendedEnrollment> {
    const {courseId, studentId, lessonId} = args.data;
    return Transaction.transact<Enrollment>(async (prismaTransaction) => {
      const enrollment = await this.enrollmentRepository.update({
        where: {
          studentId_courseId: {
            courseId,
            studentId
          }
        },
        data: {
          completedLessons: {
            connect: {
              id: lessonId
            }
          }
        },
        select: {
          id: true,
          course: {
            select: {
              hours: true,
              hasCertificate: true
            }
          },
          completedLessons: {
            select: {
              time: true,
            }
          }
        },
      }, prismaTransaction);
      const progress = this.calcCurrentProgress(enrollment.course?.hours as number, enrollment.completedLessons as any);
      (progress === 100) && enrollment.course?.hasCertificate && await this.createStudentCertificate(studentId, courseId, prismaTransaction);
      return this.enrollmentRepository.update({
        where: {
          id: enrollment.id
        },
        data: {
          progress
        },
        select: args.select,
        include: args.include
      }, prismaTransaction);
    }, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<ExtendedEnrollment> {
		return this.enrollmentRepository.delete(id, transaction);
	};
}