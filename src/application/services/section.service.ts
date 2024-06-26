import { Prisma, Section } from "@prisma/client"
import {inject, injectable } from "inversify"
import slugify from "slugify"
import { ISectionService } from "../interfaces/IServices/i-section.service"
import { IResourceOwnershipService } from "../interfaces/IServices/i-resource-ownership.service";
import { ISectionRepository } from "../interfaces/IRepositories/i-section.repository"
import { CreateSection, UpdateSection } from "../inputs/section.input"
import { TransactionType } from "../interfaces/extended/transaction-type.extend"
import { ExtendedUser } from "../interfaces/extended/user.extend"
import APIError from "../../presentation/errorHandlers/APIError"
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode"

@injectable()
export class SectionService implements ISectionService, IResourceOwnershipService<Section> {
	constructor(@inject('ISectionRepository') private sectionRepository: ISectionRepository) {}

	async isResourceBelongsToCurrentUser(user: ExtendedUser, ...sectionIds: number[]): Promise<boolean> {
		if(!user.roles.includes('Instructor')) {
			return true;
		}
		const sections = await this.findMany({
			where: {
				id: {
					in: sectionIds
				},
				course: {
					instructorId: user.instructor?.id
				}
			},
			select: {
				id: true
			}
		});
		return sections.length === sectionIds.length ? true : false;
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
		const {title, description, isDraft, order, courseId} = args.data;
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
		return this.sectionRepository.create({
			data: {
				title,
				slug,
				order,
				isDraft,
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

	update(args: {data: UpdateSection, select?: Prisma.SectionSelect, include?: Prisma.SectionInclude}, transaction: TransactionType): Promise<Section> {
		const {id, title, description, isDraft, lessons} = args.data;
		const slug = title ? slugify(title.toString(), {lower: true, trim: true}) : undefined;
		return this.sectionRepository.update({
			where: {
				id: id
			},
			data: {
				title: title || undefined,
				slug: slug || undefined,
				description:  description || undefined,
				isDraft,
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

	delete(id: number, transaction: TransactionType): Promise<Section> {
		return this.sectionRepository.delete(id, transaction);
	};
}