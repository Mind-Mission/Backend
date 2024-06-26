import { Prisma, SSOPlatform } from "@prisma/client"
import {inject, injectable } from "inversify"
import bcrypt from 'bcrypt';
import { IAuthenticationService } from "../interfaces/IServices/i-authentication.service";
import { IUserService } from "../interfaces/IServices/i-user.service";
import { JWTGenerator } from "../helpers/jwt-generator";
import { Login, Signup } from "../inputs/authentication.input";
import { ExtendedUser } from "../interfaces/extended/user.extend";
import { StudentPermissions } from "../config/student.permissions";
import { UserMapper } from "../../presentation/mapping/UserMapper";
import { SendEmail } from "../helpers/send-email";
import { MessageGenerator } from "../helpers/message-generator";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

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

  private isLastSeenWithin30Days(lastSeen: Date | null) {  
    if(lastSeen) {
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - lastSeen.getTime();
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
      return daysDifference <= 30;
    }
    return false
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
        roles: ['Student'],
        permissions: StudentPermissions
      },
      select: select ? {
        ...select,
        id: true,
        permissions: {
          select: {
            resource: true,
            cruds: true
          }
        },
        roles: true,
      } : undefined,
      include: !select ? {
        ...include,
        permissions: {
          select: {
            resource: true,
            cruds: true
          }
        },
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
        isClosed: true,
        isEmailVerified: true,
        isDeleted: true,
        isBlocked: true,
        isSignWithSSO: true,                
        platform: true,
        refreshToken: true,
        roles: true,
        lastSeen: true,
        permissions: {
          select: {
            resource: true,
            cruds: true
          }
        },
        student: {
          select: {
            id: true,
          }
        },
        instructor: {
          select: {
            id: true,
            isDeleted: true,
          }
        }
      },
    });
    if(!isExist || isExist.isDeleted || !this.isCredentialsRight(isExist, password, isSignWithSSO, platform) || (isExist.isClosed && this.isLastSeenWithin30Days(isExist.lastSeen))) {
      throw new APIError('Your email or password may be incorrect', HttpStatusCode.BadRequest);
    }
    if(isExist.isBlocked) {
      throw new APIError('Your are blocked, try to contact with our support team', HttpStatusCode.Forbidden);
    }
    let regeneratedRefreshToken = null;
    if(!isExist.refreshToken || (isExist.refreshToken && this.isRefreshTokenExpiredSoon(isExist.refreshToken))) {
      regeneratedRefreshToken = JWTGenerator.generateRefreshToken(isExist);
    }
    const updatedUser = await this.userService.update({
      data: {
        id: isExist.id,
        isClosed: true,
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
      const token = JWTGenerator.generateForgetPasswordToken(user);
      const message = MessageGenerator.getForgetPasswordMessage(user, token);
      await SendEmail.send({to: user.email, subject: "Reset Password Token", message});
      await this.userService.update({
        data: {
          id: user.id,
          resetPasswordToken: {
            token,
            isVerified: false
          }
        },
        select: {
          id: true
        }
      });
    };
  };

  async verifyResetPasswordToken(email: string, forgetPasswordToken: string): Promise<void> {
    const payload = JWTGenerator.verifyForgetPasswordToken(forgetPasswordToken);
    const user = await this.userService.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        email: true,
        resetPasswordToken: true,
      }
    });
    if(!user || !user.resetPasswordToken || user.email !== payload.email) {
      throw new APIError("Not found user or Invalid link, try to ask another link and try again", HttpStatusCode.BadRequest);
    }
    const {token} = user.resetPasswordToken as any;
    if(token !== forgetPasswordToken) {
      throw new APIError('This link is used before', HttpStatusCode.BadRequest);
    }
    await this.userService.update({
      data: {
        id: user.id,
        resetPasswordToken: {
          token,
          isVerified: true
        }
      },
      select: {
        id: true
      }
    });
  };

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userService.findFirst({
      where: {
        email: {equals: email, mode: 'insensitive'}
      },
      select: {
        id: true,
        resetPasswordToken: true
      }
    });
    if(!user || !user.resetPasswordToken) {
      throw new APIError("Not found user or link token, try to ask another link and try again", HttpStatusCode.BadRequest);
    }
    const {token, isVerified} = user.resetPasswordToken as any;
    JWTGenerator.verifyForgetPasswordToken(token);
    if(isVerified === false) {
      throw new APIError('Your link is not verified yet', HttpStatusCode.BadRequest);
    }
    await this.userService.update({
      data: {
        id: user.id,
        password: newPassword,
        resetPasswordToken: null as any,
        passwordUpdatedTime: new Date()
      },
      select: {
        id: true,
      }
    });
  };

  async refreshToken(accessToken: string, refreshToken: string): Promise<{accessToken: string, refreshToken: string}> {
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
        password: true,
        isClosed: true,
        isEmailVerified: true,
        isDeleted: true,
        isBlocked: true,
        isSignWithSSO: true,                
        platform: true,
        refreshToken: true,
        roles: true,
        permissions: {
          select: {
            resource: true,
            cruds: true
          }
        },
        student: {
          select: {
            id: true,
          }
        },
        instructor: {
          select: {
            id: true,
            isDeleted: true,
          }
        }
      },
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
    return {
      accessToken,
      refreshToken
    };
  };
}