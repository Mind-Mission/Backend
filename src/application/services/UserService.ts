import bcrypt from "bcrypt"
import { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";
import {IUserService} from "../interfaces/IServices/IUserService"
import {IUserRepository} from "../interfaces/IRepositories/IUserRepository"
import { IRoleService } from "../interfaces/IServices/IRoleService";
import { CreateUser, UpdateUser } from "../inputs/userInput";
import { ExtendedUser } from "../types/ExtendedUser";
import { ExtendedRole } from "../types/ExtendedRole";
import { TransactionType } from "../types/TransactionType";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class UserService implements IUserService {
	constructor(@inject('IUserRepository') private userRepository: IUserRepository, @inject('IRoleService') private roleService: IRoleService) {}

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
		const {firstName, lastName, email, password, mobilePhone, whatsAppNumber, bio, picture, platform, isEmailVerified, role, refreshToken, instructor} = args.data;
		if(await this.isEmailExist(email)) {
			throw new APIError('This email already exists', HttpStatusCode.BadRequest);
		};
		const isRoleExist = await this.roleService.findUnique({
			where: {
				...role as any,
			},
			select: {
				id: true,
				slug: true
			}
		});
		if(!isRoleExist) {
			throw new APIError('This role does not exist', HttpStatusCode.BadRequest);
		}
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
				role: {
					connect: {
						...role
					}
				},
				student: isRoleExist.slug === "student" ? {
					create: {
						cart: {
							create: {}
						}
					}
				} : undefined,
				instructor: isRoleExist.slug === "instructor" ? {
					create: {
						...instructor
					}
				} : undefined,
				admin: (isRoleExist.slug !== "instructor" && isRoleExist.slug !== "student") ? {
					create: {}
				} : undefined,
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	async update(args: {data: UpdateUser, select?: Prisma.UserSelect, include?: Prisma.UserInclude}, transaction?: TransactionType): Promise<ExtendedUser> {
		const {id, firstName, lastName, email, isEmailVerified, emailVerificationCode, password, passwordUpdatedTime, resetPasswordCode, bio, picture, mobilePhone, whatsAppNumber, refreshToken, isOnline, isActive, isBlocked, isDeleted, roleId, personalLinks} = args.data
		if(resetPasswordCode && resetPasswordCode.code && !resetPasswordCode.isVerified) {
			resetPasswordCode.code = bcrypt.hashSync((args.data.resetPasswordCode as any).code.toString(), 10);
		}
		if(email && await this.isEmailExist(email)) {
			throw new APIError('This email already exists', HttpStatusCode.BadRequest);
		}
		if(personalLinks) {
			const currentUser = await this.findUnique({
				where: {
					id
				},
				select: {
					role: {
						select: {
							slug: true
						}
					}
				}
			}); 
			if(currentUser && currentUser.role?.slug !== 'student' && currentUser.role?.slug !== 'instructor') {
				throw new APIError('Only students and instructors that can have personal links', HttpStatusCode.BadRequest);
			}
		}
		if(roleId) {
			const isRoleExist = await this.roleService.findUnique({
				where: {
					id: roleId
				},
				select: {
					id: true,
					slug: true
				}
			});

			if(!isRoleExist) {
				throw new APIError('This role does not exist', HttpStatusCode.BadRequest);
			}
			const currentUser = await this.findUnique({
				where: {
					id: args.data.id
				},
				select: {
					role: {
						select: {
							id: true,
							slug: true
						}
					},
					admin: {
						select: {
							id: true
						}
					}
				}
			});
			const {id, slug} = currentUser?.role as ExtendedRole;			
			if(id !== isRoleExist.id && (slug === 'student' || slug === 'instructor' || (currentUser?.admin && (isRoleExist?.slug === 'student' || isRoleExist?.slug === 'instructor')))) {
				const currentRole = (isRoleExist.slug !== 'instructor' && isRoleExist.slug !== 'student') ? 'admin' : isRoleExist.slug;
				const previousRole = (slug !== 'instructor' && slug !== 'student') ? 'admin' : slug; 
				throw new APIError(`The ${previousRole} role cannot be changed to ${currentRole} role because each one has different profile settings`, HttpStatusCode.BadRequest);
			}
		}
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
				role: roleId ? {
					connect: {
						id: roleId
					}
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