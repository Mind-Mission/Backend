import { Course, Enrollment, Prisma, Student } from "@prisma/client"
import {inject, injectable } from "inversify"
import { IStudentRepository } from "../interfaces/IRepositories/IStudentRepository";
import { IStudentService } from "../interfaces/IServices/IStudentService";
import { ExtendedStudent } from "../types/ExtendedStudent";
import { TransactionType } from "../types/TransactionType";
import { UpdateStudent } from "../inputs/studentInput";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class StudentService implements IStudentService {
	constructor(@inject('IStudentRepository') private studentRepository: IStudentRepository) {}

	private async getStudentId(userId: number): Promise<Student | null> {
		return this.findUnique({
			where: {
				userId
			},
			select: {
				id: true,
			}
		});
	};

	count(args: Prisma.StudentCountArgs): Promise<number> {
		return this.studentRepository.count(args);
	};

	findMany(args: Prisma.StudentFindManyArgs): Promise<ExtendedStudent[]> {
		return this.studentRepository.findMany(args);
	};

	findUnique(args: Prisma.StudentFindUniqueArgs): Promise<ExtendedStudent | null> {
		return this.studentRepository.findUnique(args);
	};

	findFirst(args: Prisma.StudentFindFirstArgs): Promise<ExtendedStudent | null> {
		return this.studentRepository.findFirst(args);
	};

	async update(args: {data: UpdateStudent, select?: Prisma.StudentSelect, include?: Prisma.StudentInclude}, transaction: TransactionType): Promise<ExtendedStudent> {
		const {userId, enrolledCourses, wishlistCourse} = args.data;
		const student = await this.getStudentId(userId);
		if(!student) {
			throw new APIError('This student is not exist', HttpStatusCode.BadRequest);
		}
		const studentId = student.id;
		return this.studentRepository.update({
			where: {
				id: studentId
			},
			data: {
				enrollmentCourses: enrolledCourses ? {
					upsert: enrolledCourses?.map(id => {
						return {
							where: {
								studentId_courseId: {
									studentId,
									courseId: id
								}
							},
							update: {
								course: {
									connect: {
										id
									}
								}
							},
							create: {
								course: {
									connect: {
										id
									}
								}
							},
						}
					})
				} : undefined,
				wishlistCourses: wishlistCourse ? {
					[wishlistCourse.operation]: {
						id: wishlistCourse.courseId
					}
				} : undefined
			},
			select: args.select,
			include: args.include
		}, transaction);
	};
}