import { Prisma, Role } from "@prisma/client"
import {inject, injectable } from "inversify"
import slugify from "slugify"
import {IRoleService} from "../interfaces/IServices/IRoleService"
import {IRoleRepository} from "../interfaces/IRepositories/IRoleRepository"
import { CreateRole, UpdateRole } from "../inputs/roleInput"
import { TransactionType } from "../types/TransactionType"
import APIError from "../../presentation/errorHandlers/APIError"
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode"

@injectable()
export class RoleService implements IRoleService {
	constructor(@inject('IRoleRepository') private roleRepository: IRoleRepository) {}
	
	count(args: Prisma.RoleCountArgs): Promise<number> {
		return this.roleRepository.count(args);
	};

	findMany(args: Prisma.RoleFindManyArgs): Promise<Role[]> {
		return this.roleRepository.findMany(args);
	};

	findUnique(args: Prisma.RoleFindUniqueArgs): Promise<Role | null> {
		return this.roleRepository.findUnique(args);
	};

	async create(args: {data: CreateRole, select?: Prisma.RoleSelect, include?: Prisma.RoleInclude}, transaction?: TransactionType): Promise<Role> {
		const {name, description, allowedModels} = args.data;
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
		return this.roleRepository.create({
			data: {
				name,
				slug,
				description,
				allowedModels
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	async update(args: {data: UpdateRole, select?: Prisma.RoleSelect, include?: Prisma.RoleInclude}, transaction?: TransactionType): Promise<Role> {
		const {id, name, description, allowedModels} = args.data;
		const slug = name ? slugify(name.toString(), {trim: true, lower: true}) : undefined
		if(name) {
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
		return this.roleRepository.update({
			where: {
				id
			},
			data: {
				name: name || undefined,
				slug: slug || undefined,
				description: description || undefined,
				allowedModels: allowedModels || undefined
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	async delete(id: number, transaction?: TransactionType): Promise<Role> {
		const role = await this.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				slug: true
			}
		})

		if(!role) {
			throw new Error('This role is not exist');
		}

		if(role.slug === "student" || role.slug === "instructor" || role.slug === "super-admin") {
			throw new Error('This role is not deletable');
		}
		return this.roleRepository.delete(id, transaction);
	};
}