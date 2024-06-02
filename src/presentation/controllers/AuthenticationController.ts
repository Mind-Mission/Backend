import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { IAuthenticationService } from "../../application/interfaces/IServices/i-authentication.service";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class AuthenticationController {
	constructor(@inject('IAuthenticationService') private authenticationService: IAuthenticationService) {};

  signup = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
    const {user, token} = await this.authenticationService.signup({data: request.body.input, select, include})
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'Signup successfully', [{user, token}]));
  });

  login = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
    const {user, token} = await this.authenticationService.login({data: request.body.input, select, include})
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Login successfully', [{user, token}]));
  });

  forgetPassword = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    const {email} = request.body.input;
    await this.authenticationService.forgetPassword(email);
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'If your email exists, you will receive a verification code'));
  });

  verifyResetPasswordToken = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    const {email, token} = request.body.input;
    await this.authenticationService.verifyResetPasswordToken(email, token);
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Your token is verified'));
    
  });

  resetPassword = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    const {email, newPassword} = request.body.input;
    await this.authenticationService.resetPassword(email, newPassword);
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Your password is reset successfully'));
  });

  refreshToken = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    const {accessToken, refreshToken} = request.body.input;
    const tokens = await this.authenticationService.refreshToken(accessToken, refreshToken);
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Your access token has been refreshed successfully.', [{
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }]));
  });
}