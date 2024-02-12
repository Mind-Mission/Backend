import { Request, Response, NextFunction, request } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {IRatingService} from "../../application/interfaces/IServices/IRatingService"
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class RatingController {
	constructor(@inject('IRatingService') private ratingService: IRatingService, @inject('ILogService') private logService: ILogService) {};

	getAllRatings = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.ratingService.findMany(findOptions),
			this.ratingService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All ratings are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getRatingById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const rating = await this.ratingService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!rating) {
			throw new APIError('This rating does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The rating is retrieved successfully', [rating]));
	});

	upsertRating = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const rating = await this.ratingService.upsert({
			data: {
				...request.body.input,
				userId: request.user?.id
			},
			select,
			include
		});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The rating is recorded successfully', [rating]));
	})

	deleteRating = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		await this.ratingService.delete(+request.params.id);
		this.logService.log("DELETE", "RATING", {id: +request.params.id}, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});
}