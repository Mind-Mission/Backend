import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {IStudentService} from "../../application/interfaces/IServices/IStudentService"
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import { RequestManager } from "../services/RequestManager";
import { ExtendedRequest } from "../types/ExtendedRequest";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class StudentController {
	constructor(@inject('IStudentService') private studentService: IStudentService) {};

	getAllStudents = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.studentService.findMany(findOptions),
			this.studentService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All students are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getStudentById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const student = await this.studentService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!student) {
			throw new APIError('This Student does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The student is retrieved successfully', [student]));
	});

	addToWishlist = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const {courseId} = request.body.input;
		const updatedStudent = await this.studentService.update({
			data: {
				userId: request.user?.id as number, 
				wishlistCourse: {
					operation: "connect",
					courseId
				}
			}, 
			select, 
			include
		});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The course is added to student wishlist successfully', [updatedStudent]));
	});

	removeFromWishlist = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const {courseId} = request.body.input;
		const updatedStudent = await this.studentService.update({
			data: {
				userId: request.user?.id as number, 
				wishlistCourse: {
					operation: "disconnect",
					courseId
				}
			}, 
			select, 
			include
		});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The course is removed from student wishlist successfully', [updatedStudent]));
	});
}