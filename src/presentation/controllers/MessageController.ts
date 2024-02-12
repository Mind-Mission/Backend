import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { ExtendedRequest } from "../types/ExtendedRequest";
import {IMessageService} from "../../application/interfaces/IServices/IMessageService"
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { RequestManager } from "../services/RequestManager";
import { SendEmail } from "../services/SendEmail";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class MessageController {
	constructor(@inject('IMessageService') private messageService: IMessageService, @inject('ILogService') private logService: ILogService) {};

	getAllMessages = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.messageService.findMany(findOptions),
			this.messageService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All Messages are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getMessageById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const message = await this.messageService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!message) {
			throw new APIError('This message does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The message is retrieved successfully', [message]));
	});

	createMessage = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    const {name, email, message} = request.body.input;
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdMessage = await this.messageService.create({data: {name, email, message}, select, include});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'Your message is received successfully', [createdMessage]));
	});

	updateMessage = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
    const {subject, reply} = request.body.input;
    const message = await this.messageService.findUnique({
      where: {
				id: +request.params.id,
      },
      select: {
        email: true,
      }
    });
    if(!message) {
      throw new APIError("This message is not exist", HttpStatusCode.BadRequest);
    }
		const updatedMessage = await this.messageService.update({
			data: {
				id: +request.params.id,
        subject,
				reply,
        replierId: request.user?.id as number
			},
			select,
			include,
		});
    await SendEmail.send({to: message.email, subject, message: reply});
    this.logService.log("UPDATE", "MESSAGE", {id: +request.params.id, ...request.body.input}, request.user);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The Message is replied successfully', [updatedMessage]));
	});

	deleteMessage = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const deletedMessage = await this.messageService.delete(+request.params.id);
    this.logService.log("DELETE", "MESSAGE", deletedMessage, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});
}