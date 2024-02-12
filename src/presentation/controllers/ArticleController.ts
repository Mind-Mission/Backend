import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {IArticleService} from "../../application/interfaces/IServices/IArticleService"
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class ArticleController {
	constructor(@inject('IArticleService') private articleService: IArticleService) {};

	getAllArticles = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.articleService.findMany(findOptions),
			this.articleService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All Articles are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getArticleById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const article = await this.articleService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!article) {
			throw new APIError('This Article does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The Article is retrieved successfully', [article]));
	});

	createArticle = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdArticle = await this.articleService.create({data: request.body.input, select, include});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The article is created successfully', [createdArticle]));
	});

	updateArticle = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedArticle = await this.articleService.update({data: {...request.body.input, id: +request.params.id}, select, include});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The article is updated successfully', [updatedArticle]));
	});

	deleteArticle = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		await this.articleService.delete(+request.params.id);
		response.status(HttpStatusCode.NoContent).json();
	});
}