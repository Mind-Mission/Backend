import { Prisma, Article, LessonType } from "@prisma/client"
import {inject, injectable } from "inversify"
import { CreateArticle, UpdateArticle } from "../inputs/articleInput";
import { TransactionType } from "../types/TransactionType";
import { IArticleRepository } from "../interfaces/IRepositories/IArticleRepository"
import { IArticleService } from "../interfaces/IServices/IArticleService"
import { ILessonService } from "../interfaces/IServices/ILessonService";
import { Transaction } from "../../infrastructure/services/Transaction";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class ArticleService implements IArticleService {
	constructor(@inject('IArticleRepository') private articleRepository: IArticleRepository, @inject('ILessonService') private lessonService: ILessonService) {}

	private async isLessonAvailable(lessonId: number): Promise<boolean> {
		const lesson = await this.lessonService.findUnique({
			where: {
				id: lessonId
			},
			select: {
				lessonType: true
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
		const {lessonId, title, content, time} = args.data;
		if(!await this.isLessonAvailable(lessonId)) {
			throw new APIError('This lesson is not available', HttpStatusCode.BadRequest);
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

	async update(args: {data: UpdateArticle, select?: Prisma.ArticleSelect, include?: Prisma.ArticleInclude}, transaction?: TransactionType): Promise<Article> {
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