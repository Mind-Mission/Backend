import { Prisma } from "@prisma/client"
import {inject, injectable } from "inversify"
import slugify from "slugify";
import { IInstructorRepository } from "../interfaces/IRepositories/IInstructorRepository";
import { IInstructorService } from "../interfaces/IServices/IInstructorService";
import { ExtendedInstructor } from "../types/ExtendedInstructor";
import { TransactionType } from "../types/TransactionType";
import { UpdateInstructor } from "../inputs/instructorInput";

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

	async update(args: {data: UpdateInstructor, select?: Prisma.InstructorSelect, include?: Prisma.InstructorInclude}, transaction?: TransactionType): Promise<ExtendedInstructor> {
		const {id, bref, specialization, skills} = args.data;
		return this.instructorRepository.update({
			where: {
				id
			},
			data: {
				bref: bref || undefined,
				specialization: specialization || undefined,
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
}