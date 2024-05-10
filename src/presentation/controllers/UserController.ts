import { Request, Response, NextFunction } from "express";
import { $Enums } from "@prisma/client";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { IUserService } from "../../application/interfaces/IServices/i-user.service";
import { ILogService } from "../../application/interfaces/IServices/i-log.service";
import { RequestManager } from "../services/RequestManager";
import { UserMapper } from "../mapping/UserMapper";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import { SuperAdminPermissions } from "../../application/config/super-admin.permissions";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class UserController {
	restrictedPropertiesForAdminOnly: string[] = ['isBlocked', 'permissions'];

	constructor(@inject('IUserService') private userService: IUserService, @inject('ILogService') private logService: ILogService) {}

	getUserEnums = asyncHandler((request: Request, response: Response, next: NextFunction) => {
		const userEnums = {
			Role: $Enums.Role,
			Permissions: SuperAdminPermissions
		}
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All user enums are retrieved successfully', [userEnums]));
  });

	getAllUsers = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.userService.findMany(findOptions),
			this.userService.count({where: findOptions.where})
		]);

		const mappedUserResults = UserMapper.map(promiseResult[0]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All users are retrieved successfully', mappedUserResults, promiseResult[1], findOptions.skip, findOptions.take));
	});

	getUserById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const user = await this.userService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include,
		});
		if(!user) {
			throw new APIError('This user does not exist', HttpStatusCode.BadRequest);
		}

		const mappedUserResults = UserMapper.map([user]);

		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The user is retrieved successfully', mappedUserResults));
	});

	createUser = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdUser = await this.userService.create({data: request.body.input, select, include});
		this.logService.log('ADD', 'USER', createdUser, request.user);
		const mappedUserResults = UserMapper.map([createdUser]);
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The user is created successfully', mappedUserResults));
	});

	updateUser = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {firstName, lastName, bio, picture, mobilePhone, whatsAppNumber, isClosed, isBlocked, personalLinks, roles, permissions} = request.body.input;
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedUser = await this.userService.update({
			data: {
				id: +request.params.id,
				firstName, 
				lastName, 
				bio, 
				picture, 
				mobilePhone, 
				whatsAppNumber, 
				isClosed, 
				isBlocked, 
				personalLinks,
				roles,
				permissions,
			},
			select,
			include,
		});
		this.logService.log('UPDATE', 'USER', updatedUser, request.user);
		const mappedUserResults = UserMapper.map([updatedUser]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The user is updated successfully', mappedUserResults));
	});

	beInstructor = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const user = await this.userService.update({
			data: {
				id: request.user?.id as number,
				roles: ['Instructor', 'Student']
			},
			select,
			include
		});
		const mappedUserResults = UserMapper.map([user]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The user now has instructor role', mappedUserResults));
	});

	deleteUser = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {isDeleted} = request.body.input;
		const deletedUser = await this.userService.delete({
			data: {
				id: +request.params.id,
				isDeleted
			}
		});
		this.logService.log(isDeleted ? 'DELETE' : 'RETRIEVE', 'USER', deletedUser, request.user);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, `The user is ${isDeleted ? 'deleted' : 'retrieved'} successfully`));
	});
}