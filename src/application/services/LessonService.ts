import { Prisma, Lesson, LessonType } from "@prisma/client"
import {inject, injectable } from "inversify"
import slugify from "slugify"
import { ILessonService } from "../interfaces/IServices/ILessonService"
import { ICourseService } from "../interfaces/IServices/ICourseService"
import { ILessonRepository } from "../interfaces/IRepositories/ILessonRepository"
import { CreateLesson, UpdateLesson } from "../inputs/lessonInput"
import { TransactionType } from "../types/TransactionType"
import { Transaction } from "../../infrastructure/services/Transaction"
import APIError from "../../presentation/errorHandlers/APIError"
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode"

@injectable()
export class LessonService implements ILessonService {
	constructor(@inject('ILessonRepository') private lessonRepository: ILessonRepository, @inject('ICourseService') private courseService: ICourseService) {}

	private async updateCourseInfo(lessonId: number, operationType: | "update" | "delete", transaction?: TransactionType, lessonType?: LessonType, time?: number) {
		const lesson = await this.lessonRepository.findUnique({
			where: {
				id: lessonId
			},
			select: {
				lessonType: true,
				time: true,
				section: {
					select: {
						course: {
							select: {
								id: true,
								lectures: true,
								articles: true,
								quizzes: true,
								hours: true,
							}
						}
					}
				}
			}
		}) as any;

		if(!lesson) {
			throw new APIError('This lesson is not exit', HttpStatusCode.BadRequest);
		}

		let {id, articles, lectures, quizzes, hours} = lesson.section.course;

		if(operationType === 'update' && lessonType && lessonType !== lesson.lessonType) {
			articles = lesson.lessonType === 'ARTICLE' ? articles - 1 : articles;
			lectures = lesson.lessonType === 'VIDEO' ? lectures - 1 : lectures;
			quizzes = lesson.lessonType === 'QUIZ' ? quizzes - 1 : quizzes;

			articles = lessonType === 'ARTICLE' ? articles + 1 : articles;
			lectures = lessonType === 'VIDEO' ? lectures + 1 : lectures;
			quizzes = lessonType === 'QUIZ' ? quizzes + 1 : quizzes;

			// time = lessonType && lessonType !== lesson.lessonType ? 0 : time;
		}

		if(operationType == 'delete') {
			articles = lesson.lessonType === 'ARTICLE' ? articles - 1 : articles;
			lectures = lesson.lessonType === 'VIDEO' ? lectures - 1 : lectures;
			quizzes = lesson.lessonType === 'QUIZ' ? quizzes - 1 : quizzes;
		}

		hours = time === undefined ? hours : hours + (time - lesson.time);

		await this.courseService.update({
			data: {
				id,
				articles,
				lectures,
				quizzes,
				hours
			},
			select: {
				id: true
			},
		}, transaction);
	}

	count(args: Prisma.LessonCountArgs): Promise<number> {
		return this.lessonRepository.count(args);
	};

	findMany(args: Prisma.LessonFindManyArgs): Promise<Lesson[]> {
		return this.lessonRepository.findMany(args);
	};

	findUnique(args: Prisma.LessonFindUniqueArgs): Promise<Lesson | null> {
		return this.lessonRepository.findUnique(args);
	};

	async create(args: {data: CreateLesson, select?: Prisma.LessonSelect, include?: Prisma.LessonInclude}, transaction?: TransactionType): Promise<Lesson> {
		const {title, order, attachment, isFree, isAvailable, sectionId} = args.data;
		const slug = slugify(args.data.title.toString(), {lower: true, trim: true});
		const isOrderIsFound = await this.lessonRepository.findFirst({
			where: {
				order,
				sectionId
			},
			select: {
				id: true
			}
		});
		if(isOrderIsFound) {
			throw new APIError("There is another lesson with the same order", HttpStatusCode.BadRequest);
		}
		return this.lessonRepository.create({
			data: {
				title,
				slug,
				order,
				lessonType: LessonType.UNDEFINED,
				attachment,
				isFree,
				isAvailable,
				section: {
					connect: {
						id: sectionId
					}
				}
			},	
			select: args.select,
			include: args.include
		}, transaction);
	}

	async update(args: {data: UpdateLesson, select?: Prisma.LessonSelect, include?: Prisma.LessonInclude}, transaction?: TransactionType): Promise<Lesson> {
		const {id, title, attachment, isFree, isAvailable, lessonType, time} = args.data;
		const slug = title ? slugify(title.toString(), {lower: true, trim: true}) : undefined;
		return Transaction.transact<Lesson>(async (prismaTransaction) => {
			(lessonType || time) && await this.updateCourseInfo(id, 'update', prismaTransaction, lessonType, time);
			return await this.lessonRepository.update({
				where: {
					id
				},
				data: {
					title: title || undefined,
					slug: slug || undefined,
					attachment: attachment || undefined,
					isFree,
					isAvailable,
					lessonType: lessonType || undefined,
					time,	
				},
				select: args.select,
				include: args.include
			}, prismaTransaction);
		}, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<Lesson> {
		return Transaction.transact<Lesson>(async (prismaTransaction) => {
			await this.updateCourseInfo(id, 'delete', prismaTransaction, undefined, 0);
			return this.lessonRepository.delete(id, prismaTransaction);
		}, transaction);
	};
}