import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {ILessonService} from "../../application/interfaces/IServices/ILessonService"
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class LessonController {
	constructor(@inject('ILessonService') private lessonService: ILessonService) {};

	getAllLessons = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.lessonService.findMany(findOptions),
			this.lessonService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All Lessons are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getLessonById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const lesson = await this.lessonService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!lesson) {
			throw new APIError('This Lesson does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The Lesson is retrieved successfully', [lesson]));
	});

	createLesson = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdLesson = await this.lessonService.create({data: request.body.input, select, include});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The lesson is created successfully', [createdLesson]));
	});

	updateLesson = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedLesson = await this.lessonService.update({
			data: {
				...request.body.input,
				time: undefined,
				lessonType: undefined,
				id: +request.params.id
			},
			select,
			include,
		});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The lesson is updated successfully', [updatedLesson]));
	});

	deleteLesson = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		await this.lessonService.delete(+request.params.id);
		response.status(HttpStatusCode.NoContent).json();
	});
}