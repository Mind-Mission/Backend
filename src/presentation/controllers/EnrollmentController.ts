import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { IEnrollmentService } from "../../application/interfaces/IServices/IEnrollmentService";
import { IStudentService } from "../../application/interfaces/IServices/IStudentService";
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class EnrollmentController {
	constructor(@inject('IEnrollmentService') private enrollmentService: IEnrollmentService, @inject('IStudentService') private studentService: IStudentService, @inject('ILogService') private logService: ILogService) {};

  getAllEnrollments = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.enrollmentService.findMany(findOptions),
			this.enrollmentService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All enrollment info are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getEnrollmentById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const enrollment = await this.enrollmentService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!enrollment) {
			throw new APIError('This enrollment does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The enrollment is retrieved successfully', [enrollment]));
	});

	createEnrollment = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const {userId, courseIds} = request.body.input;
		const student = await this.studentService.update({
			data: {
				userId,
				enrolledCourses: courseIds
			},
			select: {
				id: true,
				enrollmentCourses: {
					where: {
						courseId: {
							in: courseIds
						}
					},
					select,
					include
				}
			}
		});
		this.logService.log('ADD', 'ENROLLMENT', student, request.user);
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The student has been enrolled in the courses successfully.', student.enrollmentCourses));
	});

	updateEnrollment = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updateEnrollment = await this.enrollmentService.update({
			data: {
				...request.body.input,
				userId: request.user?.id
			},
			select,
			include
		});
		this.logService.log('UPDATE', 'ENROLLMENT', {...request.body.input, id: updateEnrollment.id}, request.user);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The enrollment is updated successfully', [updateEnrollment]));
	});

  deleteEnrollment = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const deletedEnrollment = await this.enrollmentService.delete(+request.params.id);
		this.logService.log('DELETE', 'ENROLLMENT', deletedEnrollment, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});

}