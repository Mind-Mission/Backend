import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {ICommentService} from "../../application/interfaces/IServices/ICommentService";
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class CommentController {
	constructor(@inject('ICommentService') private commentService: ICommentService, @inject('ILogService') private logService: ILogService) {};

	getAllComments = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.commentService.findMany(findOptions),
			this.commentService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All comments are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getCommentById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const comment = await this.commentService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!comment) {
			throw new APIError('This comment does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The comment is retrieved successfully', [Comment]));
	});

	createComment = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdComment = await this.commentService.create({data: {...request.body.input, userId: request.user?.id}, select, include});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The comment is created successfully', [createdComment]));
  });

	updateComment = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedComment = await this.commentService.update({data: {id: +request.params.id, content: request.body.input.content}, select, include});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The comment is updated successfully', [updatedComment]));
	});

	deleteComment = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const deletedComment = await this.commentService.delete(+request.params.id);
		this.logService.log("DELETE", 'COMMENT', deletedComment, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});
}