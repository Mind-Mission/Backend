import { Request, Response, NextFunction } from "express";
import { $Enums } from "@prisma/client";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { ExtendedRequest } from "../types/ExtendedRequest";
import { ICategoryService } from "../../application/interfaces/IServices/ICategoryService";
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class CategoryController {
	constructor(@inject('ICategoryService') private categoryService: ICategoryService, @inject('ILogService') private logService: ILogService) {};

	getCategoryEnums = asyncHandler((request: Request, response: Response, next: NextFunction) => {
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All category enums are retrieved successfully', [$Enums.CategoryType]));
	})

	getAllCategories = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.categoryService.findMany(findOptions),
			this.categoryService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All categories are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getCategoryById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {		
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const category = await this.categoryService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!category) {
			throw new APIError('This category does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The category is retrieved successfully', [category]));
	});

	createCategory = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const {type} = request.body.input;
		const createdCategory = await this.categoryService.create({data: request.body.input, select: {...select, id: true}, include});
		this.logService.log('ADD', type, createdCategory, request.user);
		if(!select.id) {
			Reflect.deleteProperty(createdCategory, "id");
		}
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The category is created successfully', [createdCategory]));
	});

	updateCategory = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedCategory = await this.categoryService.update({data: {...request.body.input, id: +request.params.id}, select: {...select, type: true}, include});
		this.logService.log('UPDATE', updatedCategory.type, {...request.body.input, id: +request.params.id}, request.user);
		if(!select.type) {
			Reflect.deleteProperty(updatedCategory, "type");
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The category is updated successfully', [updatedCategory]));
	});

	deleteCategory = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const deletedCategory = await this.categoryService.delete(+request.params.id);
		this.logService.log('DELETE', deletedCategory.type, deletedCategory, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});
}