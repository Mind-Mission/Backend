import { Request, Response, NextFunction } from "express";
import { $Enums } from "@prisma/client";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {IQuizService} from "../../application/interfaces/IServices/IQuizService"
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class QuizController {
	constructor(@inject('IQuizService') private quizService: IQuizService) {};

	getQuizEnums = asyncHandler((request: Request, response: Response, next: NextFunction) => {
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All quiz enums are retrieved successfully', [$Enums.QuestionLevel, $Enums.CorrectAnswer]));
  });

	getAllQuizzes = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.quizService.findMany(findOptions),
			this.quizService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All quizzes are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getQuizById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const quiz = await this.quizService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!quiz) {
			throw new APIError('This quiz does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The quiz is retrieved successfully', [quiz]));
	});

	createQuiz = asyncHandler(async(request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdQuiz = await this.quizService.create({data: request.body.input, select, include});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The quiz is created successfully', [createdQuiz]));
  });

	updateQuiz = asyncHandler(async(request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedQuiz = await this.quizService.update({
			data: {
				...request.body.input,
				id: +request.params.id
			},
			select,
			include
		});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The quiz is updated successfully', [updatedQuiz]));
  });

	deleteQuiz = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		await this.quizService.delete(+request.params.id);
		response.status(HttpStatusCode.NoContent).json();
	});
}