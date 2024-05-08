import {Request , Response, NextFunction } from "express";
import APIError from "./APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

abstract class NotFoundRoutes {
	static catch = (request: Request, response: Response, next: NextFunction) => {
		next(new APIError(`This route is not found: ${request.originalUrl}`, HttpStatusCode.NotFound));
	}
}


export default NotFoundRoutes;