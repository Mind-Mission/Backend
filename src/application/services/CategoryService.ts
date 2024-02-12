import { Prisma, Category, CategoryType } from "@prisma/client"
import {inject, injectable } from "inversify"
import slugify from "slugify"
import { ICategoryService } from "../interfaces/IServices/ICategoryService"
import { ICategoryRepository } from "../interfaces/IRepositories/ICategoryRepository"
import { CreateCategory, UpdateCategory } from "../inputs/categoryInput"
import { TransactionType } from "../types/TransactionType"
import APIError from "../../presentation/errorHandlers/APIError"
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode"

@injectable()
export class CategoryService implements ICategoryService {
	constructor(@inject('ICategoryRepository') private categoryRepository: ICategoryRepository) {}
	
	private parentChild = {
		[CategoryType.CATEGORY]: undefined,
		[CategoryType.SUBCATEGORY]: CategoryType.CATEGORY,
		[CategoryType.TOPIC]: CategoryType.SUBCATEGORY
	}

	private async isCorrectParent(type: CategoryType, parentId: number | null | undefined): Promise<boolean> {
		const parentType = this.parentChild[type];
		if(!parentId && !parentType) {
			return true;
		}
		else if(parentId && parentType) {
			const parent = await this.categoryRepository.findUnique({
				where: {
					id: parentId,
				},
				select: {
					type: true
				}
			});
	
			if(parent && parent.type === parentType) {
				return true;
			};
		}
		return false;
	}

	count(args: Prisma.CategoryCountArgs): Promise<number> {
		return this.categoryRepository.count(args);
	};

	findMany(args: Prisma.CategoryFindManyArgs): Promise<Category[]> {
		return this.categoryRepository.findMany(args);
	};

	findUnique(args: Prisma.CategoryFindUniqueArgs): Promise<Category | null> {
		return this.categoryRepository.findUnique(args);
	};

	async create(args: {data: CreateCategory, select?: Prisma.CategorySelect, include?: Prisma.CategoryInclude}, transaction?: TransactionType): Promise<Category> {
		const {name, type, description, parentId} = args.data;
		
		const slug = slugify(name, {trim: true, lower: true});
		const isExist = await this.findUnique({
			where: {
				slug
			},
			select: {
				id: true
			}
		});
		if(isExist) {
			throw new APIError('This name already exists', HttpStatusCode.BadRequest);
		}
		if(!await this.isCorrectParent(type, parentId)) {
			const errorMessage = this.parentChild[type] ? `The ${type.toLowerCase()} must belong to a ${this.parentChild[type]?.toLowerCase()}` : 'The category has no parent';
			throw new APIError(errorMessage, HttpStatusCode.BadRequest);
		}
		return this.categoryRepository.create({
			data: {
				name: name,
				slug,
				type: type,
				description: description,
				parent: parentId ? {
					connect: {
						id: parentId
					}
				} : undefined
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	async update(args: {data: UpdateCategory, select?: Prisma.CategorySelect, include?: Prisma.CategoryInclude}, transaction?: TransactionType): Promise<Category> {
		const {id, name, type, description, parentId} = args.data;
		let slug = undefined
		if(name) {
			slug = slugify(name.toString(), {trim: true, lower: true});
			const isExist = await this.findUnique({
				where: {
					slug
				},
				select: {
					id: true
				}
			});

			if(isExist && isExist.id !== id) {
				throw new APIError('This name already exists', HttpStatusCode.BadRequest);
			}
		}

		if(type || parentId) {
			const category = await this.categoryRepository.findUnique({
				where: {
					id
				},
				select: {
					type: true,
					parentId: true,
				}
			});

			const type = (args.data.type || category?.type) as CategoryType;
			const parentId = (args.data.parentId || category?.parentId) as number;

			if(!await this.isCorrectParent(type, parentId)) {
				const errorMessage = this.parentChild[type] ? `The ${type.toLowerCase()} must belong to a ${this.parentChild[type]?.toLowerCase()}` : 'The category has no parent';
				throw new APIError(errorMessage, HttpStatusCode.BadRequest);
			}
		}

		return this.categoryRepository.update({
			where: {
				id
			},
			data: {
				name: name || undefined,
				slug: slug || undefined,
				type: type || undefined,
				description: description || undefined,
				parent: parentId ? {
					connect: {
						id: parentId
					}
				} : undefined,
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<Category> {
		return this.categoryRepository.delete(id, transaction);
	};
}