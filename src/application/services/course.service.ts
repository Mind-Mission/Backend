import { Prisma, Course } from "@prisma/client";
import {inject, injectable } from "inversify";
import slugify from "slugify";
import { ICourseRepository } from "../interfaces/IRepositories/i-course.repository";
import { ICourseService } from "../interfaces/IServices/i-course.service";
import { IResourceOwnershipService } from "../interfaces/IServices/i-resource-ownership.service";
import { ICategoryService } from "../interfaces/IServices/i-category.service";
import { CreateCourse, UpdateCourse } from "../inputs/course.input";
import { ExtendedUser } from "../interfaces/extended/user.extend";
import { TransactionType } from "../interfaces/extended/transaction-type.extend";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

@injectable()
export class CourseService implements ICourseService, IResourceOwnershipService<Course> {
	constructor(@inject('ICourseRepository') private courseRepository: ICourseRepository, @inject('ICategoryService') private categoryService: ICategoryService) {}

	private async isTrueTopic(id: number): Promise<boolean> {
		const topic = await this.categoryService.findUnique({
			where: {
				id
			},
			select: {
				type: true
			}
		});
		return (topic && topic.type === 'TOPIC') ? true : false;
	};

	async isResourceBelongsToCurrentUser(user: ExtendedUser, ...courseIds: number[]): Promise<boolean> {
		if(user.roles.includes('Admin')) {
			return true;
		}
		const courses = await this.courseRepository.findMany({
			where: {
				id: {
					in: courseIds
				},
				instructorId: user.instructor?.id
			},
			select: {
				id: true
			}
		});
		return courses.length === courseIds.length ? true : false;
	};

  aggregate(args: Prisma.CourseAggregateArgs): Promise<Prisma.GetCourseAggregateType<Prisma.CourseAggregateArgs>> {
    return this.courseRepository.aggregate(args);
  };

	count(args: Prisma.CourseCountArgs): Promise<number> {
		return this.courseRepository.count(args);
	};

	findMany(args: Prisma.CourseFindManyArgs): Promise<Course[]> {
		return this.courseRepository.findMany(args);
	};

	findUnique(args: Prisma.CourseFindUniqueArgs): Promise<Course | null> {
		return this.courseRepository.findUnique(args);
	};

	findFirst(args: Prisma.CourseFindFirstArgs): Promise<Course| null> {
		return this.courseRepository.findFirst(args);
	};

  async create(args: {data: CreateCourse, select?: Prisma.CourseSelect, include?: Prisma.CourseInclude}, transaction?: TransactionType): Promise<Course> {
    const {title, shortDescription, description, language, level, imageCover, requirements, courseTeachings, price, isDraft, userId, topicId} = args.data;
		const slug = slugify(title, {lower: true, trim: true});
		if(!await this.isTrueTopic(topicId)) {
			throw new APIError("This topic may be not exist or may be exist but not a topic", HttpStatusCode.BadRequest);
		}
		return this.courseRepository.create({
			data: {
				title,
				slug,
				shortDescription,
				description,
				language,
				level,
				imageCover,
				requirements,
				courseTeachings,
				price,
				isDraft,
				instructor: {
					connect: {
						userId
					}
				},
				topic: {
					connect: {
						id: topicId
					}
				}
			},
			select: args.select,
			included: args.include
		}, transaction);
	};

	async update(args: {data: UpdateCourse, select?: Prisma.CourseSelect, include?: Prisma.CourseInclude}, transaction?: TransactionType): Promise<Course> {
    const {id, title, shortDescription, description, language, level, imageCover, requirements, courseTeachings, price, discountPercentage, hours, lectures, articles, quizzes, isDraft, sections: sections, topicId} = args.data;
		const slug = title ? slugify(title, {lower: true, trim: true}) : undefined;
		if(topicId && !await this.isTrueTopic(topicId)) {
			throw new APIError("This topic may be not exist or may be exist but not a topic", HttpStatusCode.BadRequest);
		}
		return this.courseRepository.update({
			where: {
				id
			},
			data: {
				title : title || undefined,
				slug,
        shortDescription: shortDescription || undefined,
        description: description || undefined,
        language: language || undefined,
        level: level || undefined,
        imageCover: imageCover || undefined,
        requirements: requirements || undefined,
        courseTeachings: courseTeachings || undefined,
        price: price || undefined,
        discountPercentage: discountPercentage || undefined,
				hours,
				lectures,
				articles,
				quizzes,
				isDraft,
				publishedAt: isDraft ? new Date() : undefined,
				sections: sections ? {
					update: sections.map(({id, order}) => {
						return {
							where: {
								id
							},
							data: {
								order
							}
						}
					})
				} : undefined,
        topic: topicId ? {
          connect: {
            id: topicId
          }
        } : undefined,
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<Course> {
		return this.courseRepository.delete(id, transaction);
	};
}