import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {IVideoService} from "../../application/interfaces/IServices/IVideoService"
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class VideoController {
	constructor(@inject('IVideoService') private videoService: IVideoService) {}

	getAllVideos = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.videoService.findMany(findOptions),
			this.videoService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All Videos are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getVideoById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const video = await this.videoService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!video) {
			throw new APIError('This Video does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The Video is retrieved successfully', [video]));
	});

	createVideo = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdVideo = await this.videoService.create({data: request.body.input, select, include});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The video is created successfully', [createdVideo]));
	});
	
	updateVideo = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedVideo = await this.videoService.update({
			data: {
				...request.body.input,
				id: +request.params.id
			},
			select,
			include,
		});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The video is updated successfully', [updatedVideo]));
	});
	
	deleteVideo = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		await this.videoService.delete(+request.params.id);
		response.status(HttpStatusCode.NoContent).json();
	});
}