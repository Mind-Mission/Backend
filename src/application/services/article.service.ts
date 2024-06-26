import { Prisma, Article, LessonType, Lesson } from "@prisma/client"
import {inject, injectable } from "inversify"
import { CreateArticle, UpdateArticle } from "../inputs/article.input";
import { IArticleRepository } from "../interfaces/IRepositories/i-article.repository"
import { IArticleService } from "../interfaces/IServices/i-article.service"
import { IResourceOwnershipService } from "../interfaces/IServices/i-resource-ownership.service";
import { ILessonService } from "../interfaces/IServices/i-lesson.service";
import { TransactionType } from "../interfaces/extended/transaction-type.extend";
import { ExtendedUser } from "../interfaces/extended/user.extend";
import { Transaction } from "../../infrastructure/services/Transaction";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class ArticleService implements IArticleService, IResourceOwnershipService<Article> {
	constructor(@inject('IArticleRepository') private articleRepository: IArticleRepository, @inject('ILessonService') private lessonService: ILessonService) {}

	private async isLessonAvailable(lessonId: number): Promise<Lesson | null> {
		return this.lessonService.findFirst({
			where: {
				id: lessonId,
				lessonType: {
					not: 'UNDEFINED'
				}
			},
			select: {
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

	async isResourceBelongsToCurrentUser(user: ExtendedUser, ...articleIds: number[]): Promise<boolean> {
		if(user.roles.includes('Admin')) {
			return true
		}
		const articles = await this.articleRepository.findMany({
			where: {
				id: {
					in: articleIds
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
		return articles.length === articleIds.length ? true : false;
	};

	count(args: Prisma.ArticleCountArgs): Promise<number> {
		return this.articleRepository.count(args);
	};

	findMany(args: Prisma.ArticleFindManyArgs): Promise<Article[]> {
		return this.articleRepository.findMany(args);
	};

	findUnique(args: Prisma.ArticleFindUniqueArgs): Promise<Article | null> {
		return this.articleRepository.findUnique(args);
	};

	async create(args: {data: CreateArticle, select?: Prisma.ArticleSelect, include?: Prisma.ArticleInclude}, transaction?: TransactionType): Promise<Article> {
		const {lessonId, title, content, time, user} = args.data;
		const lesson: any = await this.isLessonAvailable(lessonId)
		if(!lesson) {
			throw new APIError('This lesson is not available', HttpStatusCode.BadRequest);
		}
		if(user.roles.includes('Instructor') && lesson.section.course.instructorId !== user.instructor?.id) {
			throw new APIError('This lesson is not yours', HttpStatusCode.Forbidden);
		}
		return Transaction.transact<Article>(async (prismaTransaction) => {
			await this.updateLessonInfo(lessonId, time, 'ARTICLE', prismaTransaction);
			return await this.articleRepository.create({
				data: {
					title,
					content,
					time,
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

	update(args: {data: UpdateArticle, select?: Prisma.ArticleSelect, include?: Prisma.ArticleInclude}, transaction?: TransactionType): Promise<Article> {
		const {id, title, content, time} = args.data;
		return Transaction.transact<Article>(async (prismaTransaction) => {
			const updatedArticle = await this.articleRepository.update({
				where: {
					id: id
				},
				data: {
					title: title || undefined,
					content: content || undefined,
					time: time || undefined,
				},
				select: args.select,
				include: args.include
			}, prismaTransaction);
			if(time) {
				await this.updateLessonInfo(updatedArticle.lessonId, time, undefined, prismaTransaction);
			}
			args.select && !args.select.lessonId && Reflect.deleteProperty(updatedArticle, 'lessonId'); 
			return updatedArticle;
		}, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<Article> {
		return Transaction.transact<Article>(async (prismaTransaction) => {
			const deletedArticle = await this.articleRepository.delete(id, prismaTransaction);
			await this.updateLessonInfo(deletedArticle.lessonId, 0, 'UNDEFINED', prismaTransaction);
			return deletedArticle;
		}, transaction);
	};
}