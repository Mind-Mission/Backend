import {  Prisma } from "@prisma/client"
import {inject, injectable } from "inversify"
import { IStudentRepository } from "../interfaces/IRepositories/i-student.repository";
import { IStudentService } from "../interfaces/IServices/i-student.service";
import { IUserService } from "../interfaces/IServices/i-user.service";
import { ExtendedStudent } from "../interfaces/extended/student.extend";
import { UpdateStudent } from "../inputs/student.input";
import { TransactionType } from "../interfaces/extended/transaction-type.extend";

@injectable()
export class StudentService implements IStudentService {
	constructor(@inject('IStudentRepository') private studentRepository: IStudentRepository, @inject('IUserService') private userService: IUserService) {}

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
		const {id, enrolledCourses, wishlistCourse} = args.data;
		return this.studentRepository.update({
			where: {
				id
			},
			data: {
				enrollmentCourses: enrolledCourses ? {
					upsert: enrolledCourses?.map(courseId => {
						return {
							where: {
								studentId_courseId: {
									studentId: id,
									courseId: courseId
								}
							},
							update: {
								course: {
									connect: {
										id: courseId
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