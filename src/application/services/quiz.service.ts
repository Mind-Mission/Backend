import {Prisma, Quiz, LessonType } from "@prisma/client"
import {inject, injectable } from "inversify"
import { IQuizService } from "../interfaces/IServices/i-quiz.service"
import { ILessonService } from "../interfaces/IServices/i-lesson.service";
import { IResourceOwnershipService } from "../interfaces/IServices/i-resource-ownership.service";
import { IQuizRepository } from "../interfaces/IRepositories/i-quiz.repository"
import { CreateQuiz, UpdateQuiz } from "../inputs/quiz.input";
import { TransactionType } from "../interfaces/extended/transaction-type.extend";
import { ExtendedUser } from "../interfaces/extended/user.extend";
import { Transaction } from "../../infrastructure/services/Transaction";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class QuizService implements IQuizService, IResourceOwnershipService<Quiz> {
	constructor(@inject('IQuizRepository') private quizRepository: IQuizRepository, @inject('ILessonService') private lessonService: ILessonService) {}

	private async isLessonAvailable(lessonId: number): Promise<boolean> {
		const lesson = await this.lessonService.findUnique({
			where: {
				id: lessonId
			},
			select: {
				lessonType: true,
				section: {
					select: {
						course: {
							select: {
								instructorId: true
							}
						}
					}
				}
			}
		});

		if(lesson && lesson.lessonType === 'UNDEFINED') {
			return true
		}
		return false; 
	};

	private async updateLessonInfo(lessonId: number, time: number, lessonType?: LessonType, transaction?: TransactionType) {
		await this.lessonService.update({
			data: {
				id: lessonId,
				time,
				lessonType,
			},
			select: {
				id: true
			}
		}, transaction)
	};

	async isResourceBelongsToCurrentUser(user: ExtendedUser, ...quizIds: number[]): Promise<boolean> {
		if(user.roles.includes('Admin')) {
			return true
		}
		const quizzes = await this.quizRepository.findMany({
			where: {
				id: {
					in: quizIds
				},
				lesson: {
					section: {
						course: {
							instructorId: user.instructor?.id
						}
					}
				}
			}
		});
		return quizzes.length === quizIds.length ? true : false;
	};

	count(args: Prisma.QuizCountArgs): Promise<number> {
		return this.quizRepository.count(args);
	};

	findMany(args: Prisma.QuizFindManyArgs): Promise<Quiz[]> {
		return this.quizRepository.findMany(args);
	};

	findUnique(args: Prisma.QuizFindUniqueArgs): Promise<Quiz | null> {
		return this.quizRepository.findUnique(args);
	};

	async create(args: {data: CreateQuiz, select?: Prisma.QuizSelect, include?: Prisma.QuizInclude}, transaction?: TransactionType): Promise<Quiz> {
		const {title, description, time, questions, lessonId, user} = args.data;
		const lesson: any = await this.isLessonAvailable(lessonId)
		if(!lesson) {
			throw new APIError('This lesson is not available', HttpStatusCode.BadRequest);
		}
		if(user.roles.includes('Instructor') && lesson.section.course.instructorId !== user.instructor?.id) {
			throw new APIError('This lesson is not yours', HttpStatusCode.Forbidden);
		}
		return Transaction.transact<Quiz>(async (prismaTransaction) => {
			await this.updateLessonInfo(lessonId, time, 'QUIZ', prismaTransaction);
			return await this.quizRepository.create({
				data: {
					title,
					time,
					description,
					questions: {
						createMany: {
							data: questions.map((question, index: number) => {
								return {
									questionText: question.questionText,
									choiceA: question.choiceA,
									choiceB: question.choiceB,
									choiceC: question.choiceC,
									choiceD: question.choiceD,
									correctAnswer: question.correctAnswer,
									order: question.order || index + 1,
									level: question.level
								}
							})
						}
					},
					lesson: {
						connect: {
							id: lessonId
						}
					}
				},
				select: args.select, 
				include: args.include
			}, prismaTransaction);
		}, transaction);
	};

	update(args: {data: UpdateQuiz, select?: Prisma.QuizSelect, include?: Prisma.QuizInclude}, transaction?: TransactionType): Promise<Quiz> {
		const {id, title, description, time, questions} = args.data;
		return Transaction.transact<Quiz>(async (prismaTransaction) => {
			const updatedQuiz = await this.quizRepository.update({
				where: {
					id,
				},
				data: {
					title: title || undefined,
					time: time || undefined,
					description: description || undefined,
					questions: questions && questions.length > 0 ? {
						upsert: questions.map((question, index: number) => {
							return {
								where: {
									quizId_order: {
										quizId: id,
										order: question.order || 0
									}
								},
								update: {
									questionText: question.questionText || undefined,
									choiceA: question.choiceA || undefined,
									choiceB: question.choiceB || undefined,
									choiceC: question.choiceC || undefined,
									choiceD: question.choiceD || undefined,
									correctAnswer: question.correctAnswer || undefined,
									order: question.order || undefined,
									level: question.level || undefined,
								},
								create: {
									questionText: question.questionText,
									choiceA: question.choiceA,
									choiceB: question.choiceB,
									choiceC: question.choiceC,
									choiceD: question.choiceD,
									correctAnswer: question.correctAnswer,
									order: question.order || index + 1,
									level: question.level
								}
							}
						}) 
					} : undefined,
				},
				select: args.select ? {
					...args.select,
					lessonId: true,
				} : undefined, 
				include: args.include
			}, prismaTransaction);
			if(time) {
				await this.updateLessonInfo(updatedQuiz.lessonId, time, undefined, prismaTransaction);
			}
			args.select && !args.select.lessonId && Reflect.deleteProperty(updatedQuiz, 'lessonId');
			return updatedQuiz;
		}, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<Quiz> {
		return Transaction.transact<Quiz>(async (prismaTransaction) => {
			const deletedQuiz = await this.quizRepository.delete(id, prismaTransaction);
			await this.updateLessonInfo(deletedQuiz.lessonId, 0, 'UNDEFINED', prismaTransaction);
			return deletedQuiz;
		}, transaction);
	};
}