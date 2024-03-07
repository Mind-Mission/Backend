import { Prisma, SSOPlatform } from "@prisma/client"
import {inject, injectable } from "inversify"
import bcrypt from 'bcrypt';
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";
import { IAuthenticationService } from "../interfaces/IServices/IAuthenticationService";
import { IUserService } from "../interfaces/IServices/IUserService";
import { JWTGenerator } from "../helpers/JWTGenerator";
import { Login, Signup } from "../inputs/authenticationInput";
import { ExtendedUser } from "../types/ExtendedUser";
import { StudentPermissions } from "../config/CorePermissions";
import { UserMapper } from "../../presentation/mapping/UserMapper";
import { SendEmail } from "../helpers/SendEmail";

@injectable()
export class AuthenticationService implements IAuthenticationService {
	constructor(@inject('IUserService') private userService: IUserService) {}
  
	private isCredentialsRight(user: ExtendedUser, password?: string, isSignWithSSO?: boolean, platform?: SSOPlatform): boolean {
    return (isSignWithSSO && platform && user.isSignWithSSO === isSignWithSSO && user.platform === platform) || bcrypt.compareSync(password as string, user.password);
  };

  private isRefreshTokenExpiredSoon = (refreshToken: string): boolean => {
    const {exp} = JWTGenerator.decode(refreshToken);
    if(exp) {
      const secondsRemaining = exp - Math.floor(Date.now() / 1000);
      const daysRemaining = Math.ceil(secondsRemaining / 86400); // 60 * 60 * 24 = 86400 sec per day
      if(daysRemaining < 3) {
        return true;
      }
    }
    return false;
  };

	async signup(args: {data: Signup, select?: Prisma.UserSelect, include?: Prisma.UserInclude}): Promise<{user: any, token: string}> {
    const {firstName, lastName, email, password, mobilePhone, whatsAppNumber, bio, picture, platform, isEmailVerified} = args.data;
    const {select, include} = args;
		const createdUser = await this.userService.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        mobilePhone,
        whatsAppNumber,
        bio,
        picture,
        platform,
        isEmailVerified,
        refreshToken: JWTGenerator.generateRefreshToken({ firstName, lastName, email, picture } as ExtendedUser),
        role: 'Student',
        permissions: StudentPermissions
      },
      select: select ? {
        ...select,
        id: true,
        permissions: true,
        roles: true,
      } : undefined,
      include: !select ? {
        ...include,
        permissions: true
      } : undefined
		});
    const token = JWTGenerator.generateAccessToken({id: createdUser.id, firstName, lastName, email, picture, isActive: true, isBlocked: false, isDeleted: false, isEmailVerified, roles: createdUser.roles, permissions: createdUser.permissions});
    (!select?.permissions || !include?.permissions) && Reflect.deleteProperty(createdUser, 'permissions');
    !select?.roles && Reflect.deleteProperty(createdUser, 'roles');
		return {
			user: UserMapper.map([createdUser])[0], 
			token
		}
  };

  async login(args: {data: Login, select?: Prisma.UserSelect, include?: Prisma.UserInclude}): Promise<{user: any, token: any}> {
    const {email, password, isSignWithSSO, platform} = args.data;
		const isExist = await this.userService.findFirst({
      where: {
        email: {equals: email, mode: 'insensitive'}
      },
      select: {
        id: true,
        firstName: true, 
        lastName: true, 
        email: true, 
        picture: true,
        password: true,
        isActive: true,
        isEmailVerified: true,
        isDeleted: true,
        isBlocked: true,
        roles: true,
        permissions: true,
        isSignWithSSO: true,
        platform: true,
        refreshToken: true
      },
    });
    if(!isExist || isExist.isDeleted || !this.isCredentialsRight(isExist, password, isSignWithSSO, platform)) {
      throw new APIError('Your email or password may be incorrect', HttpStatusCode.BadRequest);
    }
    if(isExist && isExist.isBlocked) {
      throw new APIError('Your are blocked, try to contact with our support team', HttpStatusCode.Forbidden);
    }
    let regeneratedRefreshToken = null;
    if(!isExist.refreshToken || (isExist.refreshToken && this.isRefreshTokenExpiredSoon(isExist.refreshToken))) {
      regeneratedRefreshToken = JWTGenerator.generateRefreshToken(isExist);
    }
    const updatedUser = await this.userService.update({
      data: {
        id: isExist.id,
        isActive: true,
        refreshToken: regeneratedRefreshToken ? regeneratedRefreshToken : undefined
      },
      select: args.select,
      include: args.include,
    });
		return {
			user: UserMapper.map([updatedUser])[0], 
			token: JWTGenerator.generateAccessToken(isExist),
		}
  };

  async forgetPassword(email: string): Promise<void> {
    const user = await this.userService.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    });
    if(user) {
      const resetCode = Math.floor(100000 + Math.random() * 900000);
      const message = `
        <h3 style="color: black">Hi ${user.firstName} ${user.lastName}</h3>
        <p style="color: black">We received a request to reset your password on your ${process.env.APP_Name} account.</p>
        <p style="color: black">This is your reset password code</p
        <strong style="font-size: 18px">${resetCode}</strong>
        <p style="color: black">Enter this code to complete the reset</p>
        <p style="color: black">Thanks for helping us keep your account secure.</p>
        <p style="color: black">${process.env.APP_Name} Team</p>
      `;
      await SendEmail.send({to: user.email, subject: "Reset Password Code", message: message});
      await this.userService.update({
        data: {
          id: user.id,
          resetPasswordCode: {
            code: `${resetCode}`,
            expirationTime: Date.now() + 5 * 60 * 1000, // 5 minutes from the time of reset code generation
            isVerified: false
          }
        },
        select: {
          id: true
        }
      });
    };
  };

  async verifyResetPasswordCode(email: string, code: string): Promise<void> {
    const user = await this.userService.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        resetPasswordCode: true,
      }
    })
    if(user) {
      const {code: savedCode, expirationTime, isVerified} = user.resetPasswordCode as any;
      if(user.resetPasswordCode && code && bcrypt.compareSync(code, savedCode) && expirationTime >= Date.now() && !isVerified) {
        await this.userService.update({
          data: {
            id: user.id,
            resetPasswordCode: {
              code,
              expirationTime,
              isVerified: true
            }
          },
          select: {
            id: true
          }
        });
        return;
      }
    }
    throw new APIError("Not found user or Invalid code, try to ask another code and try again", HttpStatusCode.BadRequest);
  };

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userService.findFirst({
      where: {
        email: {equals: email, mode: 'insensitive'}
      },
      select: {
        id: true,
        resetPasswordCode: true
      }
    });
    if(user && user.resetPasswordCode) {
      const {expirationTime, isVerified} = user.resetPasswordCode as any;
      if(expirationTime >= Date.now() && isVerified) {
        await this.userService.update({
          data: {
            id: user.id,
            password: newPassword,
            resetPasswordCode: undefined,
            passwordUpdatedTime: new Date()
          },
          select: {
            id: true,
          }
        })
        return;
      }
    }
    throw new APIError("This code expired, try to ask another code", HttpStatusCode.BadRequest);
  };

  async refreshToken(accessToken: string, refreshToken: string): Promise<{accessToken: string, refreshToken: string}> {
    if(JWTGenerator.isTokenExpired(accessToken)) {
      JWTGenerator.verifyRefreshToken(refreshToken);
      const accessTokenPayload = JWTGenerator.decode(accessToken);
      const user = await this.userService.findFirst({
        where: {
          email: {equals: accessTokenPayload.email, mode: 'insensitive'}
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          picture: true,
          refreshToken: true
        }
      });
      if(!user || user.refreshToken !== refreshToken) {
        throw new APIError('Invalid tokens, try to login again', HttpStatusCode.BadRequest);
      }
      accessToken = JWTGenerator.generateAccessToken(user);
      if(this.isRefreshTokenExpiredSoon(refreshToken)) {
        refreshToken = JWTGenerator.generateRefreshToken(user);
        await this.userService.update({
          data: {
            id: user.id,
            refreshToken
          },
          select: {
            id: true
          }
        });
      };
    }
    return {
      accessToken,
      refreshToken
    };
  };
}