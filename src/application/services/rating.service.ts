import { Prisma, Rating } from "@prisma/client"
import { inject, injectable } from "inversify"
import { IRatingRepository } from "../interfaces/IRepositories/i-rating.repository";
import { IRatingService } from "../interfaces/IServices/i-rating.service";
import { IEnrollmentService } from "../interfaces/IServices/i-enrollment.service";
import { ExtendedEnrollment } from "../interfaces/extended/enrollment.extend";
import { TransactionType } from "../interfaces/extended/transaction-type.extend";
import { UpsertRating } from "../inputs/rating.input";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class RatingService implements IRatingService {
	constructor(@inject('IRatingRepository') private ratingRepository: IRatingRepository, @inject('IEnrollmentService') private enrollmentService: IEnrollmentService) {}

	private getStudentEnrollInThisCourse(studentId: number, courseId: number): Promise<ExtendedEnrollment | null> {
		return this.enrollmentService.findFirst({
			where: {
				studentId,
				courseId
			},
			select: {
				course: {
					select: {
						instructorId: true
					}
				}
			}
		});
	};

	aggregate(args: Prisma.RatingAggregateArgs): Promise<Prisma.GetRatingAggregateType<Prisma.RatingAggregateArgs>> {
		return this.ratingRepository.aggregate(args);
	}

	count(args: Prisma.RatingCountArgs): Promise<number> {
		return this.ratingRepository.count(args);
	};

	findMany(args: Prisma.RatingFindManyArgs): Promise<Rating[]> {
		return this.ratingRepository.findMany(args);
	};

	findUnique(args: Prisma.RatingFindUniqueArgs): Promise<Rating | null> {
		return this.ratingRepository.findUnique(args);
	};

	async upsert(args: {data: UpsertRating, select?: Prisma.RatingSelect, include?: Prisma.RatingInclude}, transaction?: TransactionType): Promise<Rating> {
		const {studentId, courseId, commentForCourse, commentForInstructor, courseRate, instructorRate} = args.data;
		const enrollment = await this.getStudentEnrollInThisCourse(studentId, courseId);
		if(!enrollment) {
			throw new APIError('The current student cannot rate the course not enroll in', HttpStatusCode.Forbidden);
		}
		const instructorId = enrollment.course?.instructorId as number;
		return this.ratingRepository.upsert({
			where: {
				studentId_courseId_instructorId: {
					courseId,
					studentId,
					instructorId
				}
			},
			update: {
				commentForCourse,
				commentForInstructor,
				courseRate,
				instructorRate,
			},
			create: {
				commentForCourse,
				commentForInstructor,
				courseRate,
				instructorRate,
				student: {
					connect: {
						id: studentId
					}
				},
				course: {
					connect: {
						id: courseId
					}
				},
				instructor: {
					connect: {
						id: instructorId
					}
				},
			},
			select: args.select,
			include: args.include
		}, transaction)
	};

	delete(id: number, transaction?: TransactionType): Promise<Rating> {
    return this.ratingRepository.delete(id, transaction);
  };
}