import { Request, Response, NextFunction } from "express";
import { $Enums } from "@prisma/client";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {IInstructorService} from "../../application/interfaces/IServices/IInstructorService"
import { ExtendedRequest } from "../types/ExtendedRequest";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class InstructorController {
	constructor(@inject('IInstructorService') private instructorService: IInstructorService) {};

	getInstructorEnums = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All instructor enums are retrieved successfully', [$Enums.HaveAudience, $Enums.TeachingType, $Enums.VideoProAcademy]));
  });

	getAllInstructors = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.instructorService.findMany(findOptions),
			this.instructorService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All instructors are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getInstructorById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const instructor = await this.instructorService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!instructor) {
			throw new APIError('This instructor does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The instructor is retrieved successfully', [instructor]));
	});

	updateInstructor = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedInstructor = await this.instructorService.update({
			data: {
				...request.body.input,
				id: +request.params.id,
			},
			select,
			include,
		});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The instructor is updated successfully', [updatedInstructor]));
	});
}