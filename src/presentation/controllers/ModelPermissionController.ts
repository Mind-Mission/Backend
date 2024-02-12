import { Request, Response, NextFunction } from "express";
import asyncHandler from'express-async-handler';
import {AllowedModels, Permissions} from '../types/ModelPermission'
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import HttpStatusCode from '../enums/HTTPStatusCode';

export class ModelPermissionController {
	constructor() {};

	getAllModelPermissions = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All models and their permissions are retrieved successfully', [{
      allowedModels: AllowedModels,
      permissions: Permissions
    }]));
	});
}