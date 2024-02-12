import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {ICertificateTemplateService} from "../../application/interfaces/IServices/ICertificateTemplateService";
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class CertificateTemplateController {
	constructor(@inject('ICertificateTemplateService') private certificateTemplateService: ICertificateTemplateService, @inject('ILogService') private logService: ILogService) {};

	getAllCertificateTemplates = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.certificateTemplateService.findMany(findOptions),
			this.certificateTemplateService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All certificate templates are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getCertificateTemplateById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select} = RequestManager.findOptionsWrapper(request);
		const certificateTemplate = await this.certificateTemplateService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
		});
		if(!certificateTemplate) {
			throw new APIError('This certificate template does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The certificate template is retrieved successfully', [certificateTemplate]));
	});

	createCertificateTemplate = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select} = RequestManager.findOptionsWrapper(request);
		const createdCertificateTemplate = await this.certificateTemplateService.create({data: {...request.body.input}, select});
		this.logService.log("ADD", 'CERTIFICATE_TEMPLATE', createdCertificateTemplate, request.user);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The certificate template is created successfully', [createdCertificateTemplate]));
	});

	updateCertificateTemplate = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select} = RequestManager.findOptionsWrapper(request);
		const updatedCertificateTemplate = await this.certificateTemplateService.update({data: {...request.body.input, id: +request.params.id}, select});
		this.logService.log("UPDATE", 'CERTIFICATE_TEMPLATE', {...request.body.input, id: +request.params.id}, request.user);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The certificate template is updated successfully', [updatedCertificateTemplate]));
	});

	deleteCertificateTemplate = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const deletedCertificateTemplate = await this.certificateTemplateService.delete(+request.params.id);
		this.logService.log("DELETE", 'CERTIFICATE_TEMPLATE', deletedCertificateTemplate, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});
}