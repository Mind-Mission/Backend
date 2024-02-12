import { Request, Response, NextFunction } from "express";
import { $Enums } from "@prisma/client";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import bcrypt from 'bcrypt';
import { IUserService } from "../../application/interfaces/IServices/IUserService";
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { ExtendedUser } from "../../application/types/ExtendedUser";
import { JWTGenerator } from "../services/JWTGenerator";
import { RequestManager } from "../services/RequestManager";
import { SendEmail } from "../services/SendEmail";
import { UserMapper } from "../mapping/UserMapper";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class UserController {
	restrictedPropertiesForAdminOnly: string[] = ['isBlocked', 'isDeleted', 'role'];

	constructor(@inject('IUserService') private userService: IUserService, @inject('ILogService') private logService: ILogService) {}

	private isUserCredentialsRight = async (email: string, password: string) => {
		const user = await this.userService.findFirst({
			where: {
				email: {equals: email, mode: 'insensitive'}
			},
			select: {
				id: true,
				email: true, 
				password: true
			}
		});

		if(user && bcrypt.compareSync(password, user.password)) {
			return user;
		}
		return null;
	};

	getUserEnums = asyncHandler((request: Request, response: Response, next: NextFunction) => {
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All user enums are retrieved successfully', [$Enums.Platform]));
  });

	getAllUsers = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.userService.findMany(findOptions),
			this.userService.count({where: findOptions.where})
		]);

		const mappedUserResults = UserMapper.map(promiseResult[0]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All users are retrieved successfully', mappedUserResults, promiseResult[1], findOptions.skip, findOptions.take));
	});

	getUserById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const user = await this.userService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include,
		});
		if(!user) {
			throw new APIError('This user does not exist', HttpStatusCode.BadRequest);
		}

		const mappedUserResults = UserMapper.map([user]);

		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The user is retrieved successfully', mappedUserResults));
	});

	createUser = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdUser = await this.userService.create({data: {...request.body.input, role: {id: request.body.input.roleId}}, select, include});
		this.logService.log('ADD', 'USER', createdUser, request.user);
		const mappedUserResults = UserMapper.map([createdUser]);
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The user is created successfully', mappedUserResults));
	});

	updateUser = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {firstName, lastName, bio, picture, mobilePhone, whatsAppNumber, isActive, isBlocked, isDeleted, roleId, personalLinks} = request.body.input;
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedUser = await this.userService.update({
			data: {
				id: +request.params.id,
				firstName, 
				lastName, 
				bio, 
				picture, 
				mobilePhone, 
				whatsAppNumber, 
				isActive, 
				isBlocked, 
				isDeleted, 
				roleId, 
				personalLinks
			},
			select,
			include,
		});
		if((request.user?.role?.slug !== "student" && request.user?.role?.slug !== "instructor")) {
			this.logService.log('UPDATE', 'USER', updatedUser, request.user);
		}
		const mappedUserResults = UserMapper.map([updatedUser]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The user is updated successfully', mappedUserResults));
	});

	updateUserEmail = asyncHandler(async (request, response, next) => {
		const {email, newEmail, password} = request.body.input;
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const user = await this.isUserCredentialsRight(email, password);
		if(!user || user.id !== +request.params.id) {
			throw new APIError('Your email or password may be incorrect', HttpStatusCode.BadRequest);
		}
		const updatedUser = await this.userService.update({
			data: {
				id: user.id,
				email: newEmail,
				isEmailVerified: false
			},
			select,
			include,
		});
		const mappedUserResults = UserMapper.map([updatedUser]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Your email is updated successfully', [{
			user: mappedUserResults[0],
			token: JWTGenerator.generateAccessToken(updatedUser),
		}]));
	});

	generateEmailVerificationCode = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		if(request.user?.isSignWithSSO) {
			throw new APIError(`You can't verify your email because you sign with ${request.user.platform?.toLowerCase()}`, HttpStatusCode.Conflict);
		}
		if(request.user?.isEmailVerified) {
			throw new APIError('Your email is already verified', HttpStatusCode.Conflict);
		}
		const token = JWTGenerator.generateEmailVerificationToken(request.user as ExtendedUser);
		await this.userService.update({
			data: {
				id: request.user?.id as number,
				emailVerificationCode: token
			},
			select: {
				id: true,
			}
		});
		const message = `<!DOCTYPE html>
		<html lang="en">
		<head>
				<meta charset="UTF-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
						body {
							font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
							background-color: #f8f8f8;
							margin: 0;
							padding: 0;
							display: flex;
							justify-content: center;
							align-items: center;
							height: 100vh;
						}
						h2 {
							color: #333;
						}
						p {
							color: #555;
							margin-bottom: 20px;
						}
						a {
							display: inline-block;
							padding: 10px 20px;
							background-color: #007BFF;
							color: #fff !important;
							text-decoration: none;
							border-radius: 5px;
						}
						a:hover {
							background-color: #0056b3;
						}
				</style>
		</head>
		<body>
			<div>
				<h2>Verify Your Email Address</h2>
				<p>Thank you for registering with us! To activate your account, please click the button below to verify your email address.</p>
				<a href="${process.env.Frontend_Verity_Email_Route}?token=${token}">Verify Email Address</a>
				<p>If you did not register for our service, you can safely ignore this email.</p>
				<p>
					<span>Best regards,</span>
					<br/>
					<span>${process.env.APP_Name} Team</span>
				</p>
			</div>
		</body>
		</html>
		`;			
		await SendEmail.send({
			to: request.user?.email as string,
			subject: 'Email Verification',
			message
		});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Verification link is sent to you on your email, please check your inbox'));
	});

	confirmEmailVerificationCode = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {token} = request.body.input;
		const payload = JWTGenerator.verifyEmailVerificationToken(token);
		const user = await this.userService.findUnique({
			where: {
				id: request.user?.id,
			},
			select: {
				id: true,
				email: true,
				emailVerificationCode: true
			}
		});
		if(!user || user.email !== payload.email || user.emailVerificationCode !== token) {
			throw new APIError('Invalid token, please try to access new verification request and try again.', HttpStatusCode.BadRequest);
		}
		!user.isEmailVerified && await this.userService.update({
			data: {
				id: user.id,
				isEmailVerified: true,
				emailVerificationCode: null
			},
			select: {
				id: true
			}
		});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Your email is verified successfully'));
	});

	updateUserPassword = asyncHandler(async (request, response, next) => {
		const {email, newPassword, password} = request.body.input;
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const user = await this.isUserCredentialsRight(email, password);
		if(!user || user.id !== +request.params.id) {
			throw new APIError('Your email or password may be incorrect', HttpStatusCode.BadRequest);
		}
		const updatedUser = await this.userService.update({ 
			data: {
				id: user.id,
				password: newPassword
			},
			select,
			include,
		});
		const mappedUserResults = UserMapper.map([updatedUser]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'Your password is updated successfully', [{
			user: mappedUserResults[0],
			token: JWTGenerator.generateAccessToken(updatedUser),
		}]));
	});

	deleteUser = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const deletedUser = await this.userService.delete(+request.params.id);
		this.logService.log('DELETE', 'USER', deletedUser, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});
}