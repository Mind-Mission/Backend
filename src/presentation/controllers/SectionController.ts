import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {ISectionService} from "../../application/interfaces/IServices/ISectionService";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class SectionController {
	constructor(@inject('ISectionService') private sectionService: ISectionService) {};

	getAllSections = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.sectionService.findMany(findOptions),
			this.sectionService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All sections are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getSectionById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const section = await this.sectionService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!section) {
			throw new APIError('This section does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The section is retrieved successfully', [section]));
	});

	createSection = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdSection = await this.sectionService.create({data: request.body.input, select, include});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The section is created successfully', [createdSection]));
  });

	updateSection = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedLesson = await this.sectionService.update({data: {...request.body.input, id: +request.params.id}, select, include});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The section is updated successfully', [updatedLesson]));
	});

	deleteSection = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		await this.sectionService.delete(+request.params.id);
		response.status(HttpStatusCode.NoContent).json();
	});
}