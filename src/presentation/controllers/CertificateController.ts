import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {ICertificateService} from "../../application/interfaces/IServices/ICertificateService";
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class CertificateController {
	constructor(@inject('ICertificateService') private certificateService: ICertificateService, @inject('ILogService') private logService: ILogService) {};

	getAllCertificates = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.certificateService.findMany(findOptions),
			this.certificateService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All certificates are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getCertificateById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const certificate = await this.certificateService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!certificate) {
			throw new APIError('This certificate does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The certificate is retrieved successfully', [certificate]));
	});

	updateCertificate = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedCertificate = await this.certificateService.update({data: {...request.body.input, id: +request.params.id}, select, include});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The certificate is updated successfully', [updatedCertificate]));
	});

	deleteCertificate = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const deletedCertificate = await this.certificateService.delete(+request.params.id);
		this.logService.log("DELETE", 'CERTIFICATE', deletedCertificate, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});
}