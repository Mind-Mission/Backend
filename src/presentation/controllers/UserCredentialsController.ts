import { Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { IUserCredentialsService } from "../../application/interfaces/IServices/i-user-credentials.service";
import { JWTGenerator } from "../../application/helpers/jwt-generator";
import { RequestManager } from "../services/RequestManager";
import { UserMapper } from "../mapping/UserMapper";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class UserCredentialsController {
	constructor(@inject('IUserCredentialsService') private userCredentialsService: IUserCredentialsService) {}

	updateUserEmail = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const user = await this.userCredentialsService.updateEmail({
			data: {
				...request.body.input,
				id: request.user?.id,
				oldEmail: request.user?.email,
			},
			select,
			include
		});
		const mappedUserResults = UserMapper.map([user]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Your email is updated successfully', [{
			user: mappedUserResults[0],
			token: JWTGenerator.generateAccessToken({...request.user, email: request.body.input.newEmail}),
		}]));
	});

	updateUserPassword = asyncHandler(async (request: ExtendedRequest, response, next) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const user = await this.userCredentialsService.updatePassword({
			data: {
				...request.body.input,
				id: request.user?.id,
				email: request.user?.email,
			},
			select,
			include
		})
		const mappedUserResults = UserMapper.map([user]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Your password is updated successfully', [{
			user: mappedUserResults[0],
			token: JWTGenerator.generateAccessToken(request.user),
		}]));
	});

	generateEmailVerificationCode = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		await this.userCredentialsService.generateEmailVerificationCode(request.user?.id as number);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Verification link is sent to you on your email, please check your inbox'));
	});

	confirmEmailVerificationCode = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {token} = request.body.input;
		await this.userCredentialsService.confirmEmailVerificationCode(request.user?.id as number, token);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Your email is verified successfully'));
	});
}