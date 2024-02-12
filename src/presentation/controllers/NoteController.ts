import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import {INoteService} from "../../application/interfaces/IServices/INoteService"
import { ExtendedRequest } from "../types/ExtendedRequest";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class NoteController {
	constructor(@inject('INoteService') private noteService: INoteService) {};

	getAllNotes = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.noteService.findMany(findOptions),
			this.noteService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All notes are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getNoteById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const note = await this.noteService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!note) {
			throw new APIError('This note does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The note is retrieved successfully', [note]));
	});

	upsertNote = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedNote = await this.noteService.upsert({
			data: {
				...request.body.input,
				userId: request.user?.id
			},
			select,
			include,
		});
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The note is recorded successfully', [updatedNote]));
	});

	deleteNote = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		await this.noteService.delete(+request.params.id);
		response.status(HttpStatusCode.NoContent).json();
	});
}