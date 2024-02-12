import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {IRoleService} from "../../application/interfaces/IServices/IRoleService"
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { RequestManager } from "../services/RequestManager";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class RoleController {
	constructor(@inject('IRoleService') private roleService: IRoleService, @inject('ILogService') private logService: ILogService) {}

	getAllRoles = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.roleService.findMany(findOptions),
			this.roleService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All roles are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getRoleById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const role = await this.roleService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!role) {
			throw new APIError('This role does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The role is retrieved successfully', [role]));
	});

	createRole = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdRole = await this.roleService.create({data: request.body.input, select, include});
		this.logService.log('ADD', 'ROLE', createdRole, request.user);
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The role is created successfully', [createdRole]));
	});

	updateRole = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const {name, description, allowedModels} = request.body.input;
		const updatedRole = await this.roleService.update({
			data: {
				...request.body.input,
				id: +request.params.id
			},
			select,
			include,
		});
		this.logService.log('UPDATE', 'ROLE', {id: +request.params.id, name, description, allowedModels}, request.user);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The role is updated successfully', [updatedRole]));
	});

	deleteRole = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const deletedRole = await this.roleService.delete(+request.params.id);
		this.logService.log('DELETE', 'ROLE', deletedRole, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});
}