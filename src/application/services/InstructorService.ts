import { Prisma } from "@prisma/client"
import {inject, injectable } from "inversify"
import slugify from "slugify";
import { IInstructorRepository } from "../interfaces/IRepositories/IInstructorRepository";
import { IInstructorService } from "../interfaces/IServices/IInstructorService";
import { ExtendedInstructor } from "../types/ExtendedInstructor";
import { UpdateInstructor } from "../inputs/instructorInput";
import { TransactionType } from "../types/TransactionType";
import { StudentPermissions } from "../config/StudentPermissions";
import { InstructorPermissions } from "../config/InstructorPermissions";

@injectable()
export class InstructorService implements IInstructorService {
	constructor(@inject('IInstructorRepository') private instructorRepository: IInstructorRepository) {}

	count(args: Prisma.InstructorCountArgs): Promise<number> {
		return this.instructorRepository.count(args);
	};

	findMany(args: Prisma.InstructorFindManyArgs): Promise<ExtendedInstructor[]> {
		return this.instructorRepository.findMany(args);
	};

	findUnique(args: Prisma.InstructorFindUniqueArgs): Promise<ExtendedInstructor | null> {
		return this.instructorRepository.findUnique(args);
	};

	update(args: {data: UpdateInstructor, select?: Prisma.InstructorSelect, include?: Prisma.InstructorInclude}, transaction?: TransactionType): Promise<ExtendedInstructor> {
		const {id, bref, specialization, teachingType, haveAudience, videoProAcademy, skills, isClosed} = args.data;
		return this.instructorRepository.update({
			where: {
				id
			},
			data: {
				bref: bref || undefined,
				specialization: specialization || undefined,
				teachingType: teachingType || undefined,
				haveAudience: haveAudience || undefined,
				videoProAcademy: videoProAcademy || undefined,
				isClosed,
				skills: skills ? {
					upsert: skills.map(({name}) => {
						const slug = slugify(name, {lower: true, trim: true});
						return {
							where: {
								slug_instructorId: {
									instructorId: id,
									slug,
								},
							},
							update: {
								name: name,
								slug
							},
							create: {
								name: name,
								slug
							}
						}
					})
				} : undefined
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	delete(args: {data: {userId: number, isDeleted: boolean}, select?: Prisma.InstructorSelect, include?: Prisma.InstructorInclude}, transaction?: TransactionType): Promise<ExtendedInstructor> {
		const {userId, isDeleted} = args.data;
		return this.instructorRepository.update({
			where: {
				userId
			},
			data: {	
				isDeleted,
				user: {
					update: {
						roles: isDeleted ? ['Student'] : ['Student', 'Instructor'],
						permissions: isDeleted ? {
							deleteMany: {},
							createMany: {
								data: StudentPermissions
							}
						} : {
							upsert: InstructorPermissions.map(({resource, cruds}) => {
								return {
									where: {
										resource_userId: {
											userId,
											resource
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
						}
					}
				}
			},
			select: args.select,
			include: args.include
		}, transaction);
	};
}