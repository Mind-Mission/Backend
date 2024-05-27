import {Request, Response, NextFunction} from 'express';
import { validationResult } from 'express-validator/src/validation-result';
import APIError  from "./APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

abstract class ExpressErrorValidator {
	static catchExpressValidatorErrors (request: Request, response: Response, next: NextFunction) {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map(error => error.msg);
			throw new APIError(errorMessages, HttpStatusCode.BadRequest)
		}
		next();
	}
}

export default ExpressErrorValidator