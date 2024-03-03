import { Prisma, Section } from "@prisma/client"
import {inject, injectable } from "inversify"
import slugify from "slugify"
import { ISectionService } from "../interfaces/IServices/ISectionService"
import { ICourseService } from "../interfaces/IServices/ICourseService"
import { ISectionRepository } from "../interfaces/IRepositories/ISectionRepository"
import { CreateSection, UpdateSection } from "../inputs/sectionInput"
import { TransactionType } from "../types/TransactionType"
import { ExtendedUser } from "../types/ExtendedUser"
import APIError from "../../presentation/errorHandlers/APIError"
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode"

@injectable()
export class SectionService implements ISectionService {
	constructor(@inject('ISectionRepository') private sectionRepository: ISectionRepository, @inject('ICourseService') private courseService: ICourseService) {}

	async isResourceBelongsToCurrentUser(sectionId: number, user: ExtendedUser): Promise<boolean> {
		if(!user.roles.includes('Instructor')) {
			return true;
		}
		const section = await this.findFirst({
			where: {
				id: sectionId,
				course: {
					instructor: {
						userId: user.id
					}
				}
			},
			select: {
				id: true
			}
		});
		return section ? true : false;
	};

	count(args: Prisma.SectionCountArgs): Promise<number> {
		return this.sectionRepository.count(args);
	};

	findMany(args: Prisma.SectionFindManyArgs): Promise<Section[]> {
		return this.sectionRepository.findMany(args);
	};

	findUnique(args: Prisma.SectionFindUniqueArgs): Promise<Section | null> {
		return this.sectionRepository.findUnique(args);
	};

	findFirst(args: Prisma.SectionFindFirstArgs): Promise<Section | null> {
		return this.sectionRepository.findFirst(args);
	};

  async create(args: {data: CreateSection, select?: Prisma.SectionSelect, include?: Prisma.SectionInclude}, transaction?: TransactionType): Promise<Section> {
		const {title, description, isAvailable, order, courseId, user} = args.data;
		const slug = slugify(title, {lower: true, trim: true});
		const isOrderExist = await this.findFirst({
			where: {
				courseId: courseId,
				order: order
			},
			select: {
				id: true
			}
		});
		if(isOrderExist) {
			throw new APIError('There is already section with the same order', HttpStatusCode.BadRequest);
		}
		if(!await this.courseService.isResourceBelongsToCurrentUser(courseId, user)) {
			throw new APIError('This course is not yours', HttpStatusCode.Forbidden);
		}
		return this.sectionRepository.create({
			data: {
				title,
				slug,
				order,
				isAvailable,
				description,
				course: {
					connect: {
						id: courseId
					}
				}
			},
			select: args?.select,
			include: args?.include
		}, transaction);
	};

	async update(args: {data: UpdateSection, select?: Prisma.SectionSelect, include?: Prisma.SectionInclude}, transaction: TransactionType): Promise<Section> {
		const {id, title, description, isAvailable, lessons, user} = args.data;
		const slug = title ? slugify(title.toString(), {lower: true, trim: true}) : undefined;
		if(!await this.isResourceBelongsToCurrentUser(id, user)) {
			throw new APIError('This section is not yours', HttpStatusCode.Forbidden);
		}
		return this.sectionRepository.update({
			where: {
				id: id
			},
			data: {
				title: title || undefined,
				slug: slug || undefined,
				description:  description || undefined,
				isAvailable,
				lessons: lessons ? {
					update: lessons.map(({id, order}) => {
						return {
							where: {
								id
							},
							data: {
								order
							}
						}
					})
				} : undefined
			},
			select: args?.select,
			include: args?.include
		}, transaction);
	}

	async delete(args: {id: number, user: ExtendedUser}, transaction: TransactionType): Promise<Section> {
		const {id, user} = args; 
		if(!await this.isResourceBelongsToCurrentUser(id, user)) {
			throw new APIError('This section is not yours', HttpStatusCode.Forbidden);
		}
		return this.sectionRepository.delete(id, transaction);
	};
}