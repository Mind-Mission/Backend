import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt"
import { inject, injectable } from "inversify";
import {IUserService} from "../interfaces/IServices/IUserService"
import {IUserRepository} from "../interfaces/IRepositories/IUserRepository"
import { InstructorPermissions } from "../config/InstructorPermissions";
import { StudentPermissions } from "../config/StudentPermissions";
import { StudentInstructorPermissions } from "../config/StudentInstructorPermissions";
import { CreateUser, UpdateUser } from "../inputs/userInput";
import { ExtendedUser } from "../types/ExtendedUser";
import { TransactionType } from "../types/TransactionType";

@injectable()
export class UserService implements IUserService {
	constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

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

	create(args: {data: CreateUser, select?: Prisma.UserSelect; include?: Prisma.UserInclude}, transaction?: TransactionType): Promise<ExtendedUser> {
		let {firstName, lastName, email, password, mobilePhone, whatsAppNumber, bio, picture, platform, isEmailVerified, roles, permissions, refreshToken} = args.data;
		if(roles.includes('Admin')) {
			roles = ['Admin'];
		}
		else {
			if(roles.includes('Student')) {
				roles = ['Student'];
				permissions = StudentPermissions
			}
			if(roles.includes('Instructor')) {
				roles = ['Student', 'Instructor'];
				permissions = StudentInstructorPermissions
			}
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
				roles,
				student: roles.includes("Student") ? {
					create: {
						cart: {
							create: {}
						}
					}
				} : undefined,
				instructor: roles.includes('Instructor') ? {
					create: {}
				} : undefined,
				admin: roles.includes('Admin') ? {
					create: {}
				} : undefined,
				permissions: {
					createMany: {
						data: permissions
					}
				},
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	async update(args: {data: UpdateUser, select?: Prisma.UserSelect, include?: Prisma.UserInclude}, transaction?: TransactionType): Promise<ExtendedUser> {
		let {id, firstName, lastName, email, isEmailVerified, emailVerificationCode, password, passwordUpdatedTime, resetPasswordCode, bio, picture, mobilePhone, whatsAppNumber, refreshToken, isOnline, isActive, isBlocked, isDeleted, roles, permissions, personalLinks} = args.data
		if(resetPasswordCode && resetPasswordCode.code && !resetPasswordCode.isVerified) {
			resetPasswordCode.code = bcrypt.hashSync((args.data.resetPasswordCode as any).code, 10);
		}
		const isStudentWantToBeInstructor = roles && roles.includes('Instructor') && roles.includes('Student') && !roles.includes('Admin') ? true : false;
		permissions = isStudentWantToBeInstructor ? InstructorPermissions : permissions;
		return this.userRepository.update({
			where: {
				id
			},
			data: {
				firstName: firstName || undefined,
				lastName: lastName || undefined,
				email: email || undefined,
				isEmailVerified,
				emailVerificationCode,
				password: password ? bcrypt.hashSync(password.toString(), 10) : undefined,
				resetPasswordCode,
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
				roles: isStudentWantToBeInstructor ? {
					set: ['Student', 'Instructor']
				} : undefined,
				instructor: isStudentWantToBeInstructor ? {
					create: {}
				} : undefined,
				permissions: permissions ? {
					upsert: permissions.map(({resource, cruds}) => {
						return {
							where: {
								resource_userId: {
									userId: id,
									resource,
								}
							},
							update: {
								cruds
							},
							create: {
								resource,
								cruds
							}
						}
					})
				} : undefined,
				personalLinks: personalLinks && personalLinks.length > 0 ? {
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