import { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";
import bcrypt from 'bcrypt';
import { IUserCredentialsService } from "../interfaces/IServices/i-user-credentials.service";
import { IUserService } from "../interfaces/IServices/i-user.service";
import { ExtendedUser } from "../interfaces/extended/user.extend";
import { JWTGenerator } from "../helpers/jwt-generator";
import { SendEmail } from "../helpers/send-email";
import { MessageGenerator } from "../helpers/message-generator";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class UserCredentialsService implements IUserCredentialsService {
	constructor(@inject('IUserService') private userService: IUserService){}
  
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

  async updateEmail(args: { data: { id: number; oldEmail: string; newEmail: string; password: string}; select?: Prisma.UserSelect; include: Prisma.UserInclude }): Promise<ExtendedUser> {
    const {id, oldEmail, newEmail, password} = args.data;
    const user = await this.isUserCredentialsRight(oldEmail, password);
		if(!user || user.id !== id) {
			throw new APIError('Your email or password may be incorrect', HttpStatusCode.BadRequest);
		}
		return this.userService.update({
			data: {
				id: user.id,
				email: newEmail,
				isEmailVerified: false
			},
			select: args.select,
			include: args.include,
		});
  };

  async updatePassword(args: { data: { id: number; email: string; oldPassword: string; newPassword: string;}, select?: Prisma.UserSelect, include?: Prisma.UserInclude }): Promise<ExtendedUser> {
		const {id, email, oldPassword, newPassword} = args.data;
    const user = await this.isUserCredentialsRight(email, oldPassword);
		if(!user || user.id !== id) {
			throw new APIError('Your email or password may be incorrect', HttpStatusCode.BadRequest);
		}
		return this.userService.update({ 
			data: {
				id: user.id,
				password: newPassword
			},
			select: args?.select,
			include: args?.include,
		});
  };

  async generateEmailVerificationCode(id: number): Promise<void> {
    const user = await this.userService.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        firstName: true, 
        lastName: true, 
        email: true, 
        picture: true,
        isSignWithSSO: true,
        isEmailVerified: true
      }
    });
    if(!user) {
      throw new APIError('Not Exist', HttpStatusCode.BadRequest);
    }
    if(user?.isSignWithSSO) {
			throw new APIError(`You can't verify your email because you sign with`, HttpStatusCode.Conflict);
		}
		if(user?.isEmailVerified) {
			throw new APIError('Your email is already verified', HttpStatusCode.Conflict);
		}
		const token = JWTGenerator.generateEmailVerificationToken(user);
		await this.userService.update({
			data: {
				id: id as number,
				emailVerificationCode: token
			},
			select: {
				id: true,
			}
		});		
		await SendEmail.send({
			to: user.email,
			subject: 'Email Verification',
			message: MessageGenerator.getEmailVerificationCodeMessage(token)
		});
  };
  
  async confirmEmailVerificationCode(id: number, token: string): Promise<void> { 
    const payload = JWTGenerator.verifyEmailVerificationToken(token);
		const user = await this.userService.findUnique({
			where: {
				id
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
  };
}