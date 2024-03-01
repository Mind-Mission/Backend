import bcrypt from "bcrypt"
import { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";
import {IUserService} from "../interfaces/IServices/IUserService"
import {IUserRepository} from "../interfaces/IRepositories/IUserRepository"
import { CreateUser, UpdateUser } from "../inputs/userInput";
import { ExtendedUser } from "../types/ExtendedUser";
import { TransactionType } from "../types/TransactionType";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class UserService implements IUserService {
	constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

	private async isEmailExist(email: string, id?: number): Promise<boolean> {
		const user = await this.findFirst({
			where: {
				email: {
					equals: email,
					mode: 'insensitive'
				}
			},
			select: {
				id: true
			}
		});
		if(user && (id ? user.id !== id : true)) {
			return true;
		};
		return false
	};

	count(args: Prisma.UserCountArgs): Promise<number> {
		return this.userRepository.count(args);
	};

	findMany(args: Prisma.UserFindManyArgs): Promise<ExtendedUser[]> {
		return this.userRepository.findMany(args);
	};

	findUnique(args: Prisma.UserFindUniqueArgs): Promise<ExtendedUser | null> {
    return this.userRepository.findUnique(args);
  };

	findFirst(args: Prisma.UserFindFirstArgs): Promise<ExtendedUser | null> {
		return this.userRepository.findFirst(args);
	};

	async create(args: {data: CreateUser, select?: Prisma.UserSelect; include?: Prisma.UserInclude}, transaction?: TransactionType): Promise<ExtendedUser> {
		const {firstName, lastName, email, password, mobilePhone, whatsAppNumber, bio, picture, platform, isEmailVerified, permissions, role, refreshToken, instructor} = args.data;
		// if(await this.isEmailExist(email)) {
		// 	throw new APIError('This email already exists', HttpStatusCode.BadRequest);
		// };
		return this.userRepository.create({
			data: {
				firstName,
				lastName,
				email,
				password: bcrypt.hashSync(password, 10),
				mobilePhone,
				whatsAppNumber,
				bio,
				picture,
				platform,
				isSignWithSSO: platform ? true : false,
				isEmailVerified,
				refreshToken,
				permissions: {
					createMany: {
						data: permissions
					}
				},
				role,
				student: role === "Student" ? {
					create: {
						cart: {
							create: {}
						}
					}
				} : undefined,
				instructor: role === "Instructor" && instructor ? {
					create: {
						...instructor,
					}
				} : undefined,
				admin: role === 'Admin' ? {
					create: {}
				} : undefined,
			},
			select: args.select,
			include: args.include
		} , transaction);
	};

	async update(args: {data: UpdateUser, select?: Prisma.UserSelect, include?: Prisma.UserInclude}, transaction?: TransactionType): Promise<ExtendedUser> {
		const {id, firstName, lastName, email, isEmailVerified, emailVerificationCode, password, passwordUpdatedTime, resetPasswordCode, bio, picture, mobilePhone, whatsAppNumber, refreshToken, isOnline, isActive, isBlocked, isDeleted, permissions, personalLinks} = args.data
		if(resetPasswordCode && resetPasswordCode.code && !resetPasswordCode.isVerified) {
			resetPasswordCode.code = bcrypt.hashSync((args.data.resetPasswordCode as any).code.toString(), 10);
		}
		// if(email && await this.isEmailExist(email)) {
		// 	throw new APIError('This email already exists', HttpStatusCode.BadRequest);
		// }
		return this.userRepository.update({
			where: {
				id
			},
			data: {
				firstName: firstName || undefined,
				lastName: lastName || undefined,
				email: email || undefined,
				isEmailVerified: isEmailVerified || undefined,
				emailVerificationCode,
				password: password ? bcrypt.hashSync(password.toString(), 10) : undefined,
				resetPasswordCode: resetPasswordCode || undefined,
				passwordUpdatedTime: passwordUpdatedTime || undefined,
				bio: bio,
				picture: picture || undefined,
				mobilePhone: mobilePhone || undefined,
				whatsAppNumber: whatsAppNumber || undefined,
				refreshToken: refreshToken || undefined,
				isOnline: isOnline,
				isActive: isActive,
				isBlocked: isBlocked,
				isDeleted: isDeleted,
				permissions: permissions ? {
					upsert: permissions.map(({id, resource, cruds}) => {
						return {
							where: {
								id
							},
							update: {
								resource,
								cruds
							},
							create: {
								resource,
								cruds
							}
						}
					})
				} : undefined,
				personalLinks: personalLinks ? {
					upsert: personalLinks.map(({platform, link}) => {
						return {
							where : {
								userId_platform: {
									userId: id,
									platform: platform.toUpperCase(),
								}
							},
							update: {
								link
							},
							create: {
								platform: platform.toUpperCase(),
								link
							}
						}
					})
				} : undefined,
				lastSeen: isOnline === false ? new Date() : undefined
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<ExtendedUser> {
		return this.userRepository.delete(id, transaction);
	};
}